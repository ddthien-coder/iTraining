package com.devteam.core.module.data.db.query;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.util.ds.Arrays;
import com.devteam.core.util.ds.Collections;
import com.devteam.core.util.ds.MapObject;
import com.devteam.core.util.text.StringUtil;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.Setter;

@JsonInclude(Include.NON_NULL)
public class SqlQuery extends SqlQueryParams {
  @Getter @Setter
  private List<EntityTable>         from;

  private List<SelectField>         selectFields;
  
  @Getter @Setter
  private List<ClauseFilter>        clauseFilters;

  @Getter @Setter
  private List<ParamFilter>         paramFilters;

  @Getter @Setter
  private List<Join>                joins;
  
  @Getter @Setter
  private String[]                  groupBy;
  
  public SqlQuery() { }
  
  public SqlQueryParams getSqlQueryParams() {
    return new SqlQueryParams(filters, optionFilters, rangeFilters, orderBy, maxReturn);
  }
  
  public SearchFilter filter(String name) { return filters.get(name); }
  
  public RangeFilter range(String name) { return rangeFilters.get(name); }
  
  public OptionFilter option(String name) { return optionFilters.get(name); }
  
  public SqlQuery ADD_TABLE(EntityTable ... tables) {
    from = Arrays.addToList(from, tables);
    return this;
  }

  public List<SelectField> getSelectFields() {
    if(selectFields == null) {
      for(EntityTable table : from) {
        selectFields = Collections.addToList(selectFields, table.getSelectFields());
      }
      if(this.joins != null) {
        for(Join  join : joins) {
          selectFields = Collections.addToList(selectFields, join.getSelectFields());
        }
      }
    }
    return selectFields;
  }
  
  public SqlQuery JOIN(Join join) {
    joins = Arrays.addToList(joins, join);
    return this;
  }

  public SqlQuery FILTER(ClauseFilter ... filter) {
    clauseFilters = Arrays.addToList(clauseFilters, filter);
    return this;
  }

  public SqlQuery FILTER(ParamFilter ... filter) {
    paramFilters = Arrays.addToList(paramFilters, filter);
    return this;
  }
  
  public SqlQuery FILTER(FieldFilter ... filter) {
    super.FILTER(filter);
    return this;
  }

  public SqlQuery FILTER(SearchFilter  ... filter) {
    super.FILTER(filter);
    return this;
  }
  
  public SqlQuery GROUPBY(String ... field) {
    this.groupBy = field;
    return this;
  }

  public SqlQuery ORDERBY(String ... field) {
    this.orderBy = new OrderBy(field, field);
    return this;
  }
  
  public SqlQuery ORDERBY(String[] fields, String selectedField, String order) {
    this.orderBy = new OrderBy(fields, selectedField, order);
    return this;
  }
  
  public SqlQuery mergeValue(SqlQueryParams params) {
    if(params == null) return this;
    if(params.getFilters() != null) {
      for(SearchFilter sel : params.getFilters()) {
        filters.get(sel.getName()).mergeValue(sel);
      }
    }
    
    if(params.getRangeFilters() != null) {
      for(RangeFilter sel : params.getRangeFilters()) {
        rangeFilters.get(sel.getName()).mergeValue(sel);
      }
    }
    
    if(params.getOptionFilters() != null) {
      for(OptionFilter sel : params.getOptionFilters()) {
        optionFilters.get(sel.getName()).mergeValue(sel);
      }
    }
    if(params.getOrderBy() != null) {
      orderBy.mergeValue(params.getOrderBy());
    }

    if(params.getParams() != null) {
      if(this.params == null) this.params = new MapObject();
      for(Map.Entry<String, Object>  entry : params.getParams().entrySet()) {
        if(entry.getValue() == null) continue;
        this.params.put(entry.getKey(), entry.getValue());
      }
    }
    maxReturn = params.getMaxReturn();
    return this;
  }
  

  public String toSql(ClientInfo client) {
    StringBuilder b = new StringBuilder();
    b.append("SELECT ");
    b.append("\n");
    List<SelectField> selectFields = getSelectFields();
    if((selectFields == null || selectFields.size() == 0)) {
      b.append(" * ");
    } else {
      boolean firstField = true;
      if(selectFields != null) {
        for(int i = 0; i < selectFields.size(); i++) {
          SelectField field = selectFields.get(i);
          if(!firstField) b.append(",\n");
          String alias = field.getAlias();
          if(alias == null) alias = field.getFieldExpression();
          b.append(field.createSelectExpression());
          firstField = false;
        }
      }
    }

    if(from != null) {
      b.append("\n");
      b.append("FROM");
      for(int i = 0; i < from.size(); i++) {
        if(i > 0) b.append(", ");
        else b.append(" ");
        EntityTable table = from.get(i);
        b.append(table.getTable());
      }
    }
    if(joins != null) {
      for(Join selOuterJoin : this.joins) {
        b.append("\n");
        b.append(selOuterJoin.createJoin(this));
      }
    }
    String filterClauses = buildClauses(client);
    if(filterClauses != null) {
      b.append("\n");
      b.append("WHERE\n").
        append(filterClauses);
    }

    if(groupBy != null) {
      b.append("\n");
      b.append("GROUP BY ");
      for(int i = 0; i < groupBy.length; i++) {
        if(i > 0) b.append(", ");
        else b.append(" ");
        b.append(groupBy[i]);
      }
    }

    if(orderBy != null && orderBy.selectFields != null && orderBy.selectFields.length > 0) {
      b.append("\n");
      b.append("ORDER BY ");
      String[] orderByField = orderBy.selectFields;
      for(int i = 0; i < orderByField.length; i++) {
        if(i > 0) b.append(", ");
        else b.append(" ");
        b.append(orderByField[i]);
      }
      String order = orderBy.getSort();
      if(order != null) b.append(" ").append(orderBy.getSort());
    }

    if(maxReturn > 0) {
      b.append(" LIMIT ").append(maxReturn);
    }
    return  b.toString(); 
  }

  String buildClauses(ClientInfo client) {
    StringBuilder b = new StringBuilder();
    if(Collections.isNotEmpty(clauseFilters)) {
      for(ClauseFilter sel : clauseFilters) {
        if(b.length() > 0 ) b.append(" AND \n");
        b.append("  (").append(sel.getClause()).append(")");
      }
    }

    if(Collections.isNotEmpty(paramFilters)) {
      for(ParamFilter sel : paramFilters) {
        if(!sel.isApply(this)) continue;
        if(b.length() > 0 ) b.append(" AND \n");
        b.append("  (").append(sel.getClause()).append(")");
      }
    }

    String filterClauses = buildFilterClauses();
    if(filterClauses != null) {
      if(b.length() > 0 ) b.append(" AND \n");
      b.append("  (").append(filterClauses).append(")");
    }
    if(b.length() == 0) return null;
    return b.toString();
  }
  
  String buildFilterClauses() {
    StringBuilder b = new StringBuilder();
    if(rangeFilters != null && rangeFilters.size() > 0) {
      for(RangeFilter sel : rangeFilters.values()) {
        String fromValue = sel.getFromValue();
        String toValue = sel.getToValue();
        if(StringUtil.isEmpty(fromValue) && StringUtil.isEmpty(toValue)) continue;
        if(b.length() > 0 ) {
          b.append(" AND \n");
        }
        b.append("(");
        if(!StringUtil.isEmpty(fromValue)) {
          b.append(sel.createFromFilterExpression());
        }
        
        if(!StringUtil.isEmpty(toValue)) {
          if(!StringUtil.isEmpty(fromValue)) b.append(" AND ");
          b.append(sel.createToFilterExpression());
        }
        b.append(")");
      }
    }
    
    if(optionFilters != null && optionFilters.size() > 0) {
      for(OptionFilter sel : optionFilters.values()) {
        String selOpt = sel.getSelectOption();
        if(StringUtil.isEmpty(selOpt)) continue;
        if(b.length() > 0 ) {
          b.append(" AND \n");
        }
        b.append("  (").append(sel.createFilterExpression()).append(")");
      }
    }
    
    if(filters != null && filters.size() > 0) {
      for(SearchFilter sel : filters.values()) {
        if(!sel.hasValue()) continue;
        if(b.length() > 0 ) {
          if(sel.isRequired()) b.append(" AND \n");
          else b.append(" OR \n");
        }
        b.append("  (").append(sel.getFilterExpression()).append(")");
      }
    }
    if(b.length() == 0) return null;
    return b.toString();
  }
  
  public Map<String, Object> createQueryParams(ClientInfo client) {
    Map<String, Object> queryParams = new HashMap<String, Object>();

    List<RangeFilter> rangeFilters = getRangeFilters();
    if(rangeFilters != null) {
      for(RangeFilter sel : getRangeFilters()) {
        if(!sel.isApplied()) continue;
        Object fromObj = sel.createFromFilterValue();
        Object toObj = sel.toSqlToFilterValue();
        if(fromObj != null) queryParams.put("from_" + sel.getName(), fromObj);
        if(toObj != null)   queryParams.put("to_" + sel.getName(), toObj);
      }
    }
    
    List<OptionFilter> optionFilters = getOptionFilters();
    if(optionFilters != null) {
      for(OptionFilter sel : getOptionFilters()) {
        Object value = sel.createFilterParamValue();
        if(value == null) continue;
        queryParams.put(sel.getName(), value);
      }
    }
    
    List<SearchFilter> filters = getFilters();
    if(filters != null) {
      for(SearchFilter sel : filters) {
        if(!sel.hasValue()) continue;
        Object filterValue = sel.createFilterParamValue();
        queryParams.put(sel.getName(), filterValue);
      }
    }
    if(params != null) {
      queryParams.putAll(params);
    }
    return queryParams ;
  }
}