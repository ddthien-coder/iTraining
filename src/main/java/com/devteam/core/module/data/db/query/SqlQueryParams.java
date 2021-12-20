package com.devteam.core.module.data.db.query;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.devteam.core.util.ds.MapObject;
import com.devteam.core.util.text.StringUtil;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.Setter;

@JsonInclude(Include.NON_NULL)
public class SqlQueryParams {
  @Getter @Setter
  protected MapObject params;
 
  protected Map<String, SearchFilter>    filters;
  protected Map<String, OptionFilter>  optionFilters;
  protected Map<String, RangeFilter>   rangeFilters;

  @Getter @Setter
  protected OrderBy           orderBy;
  
  @Getter @Setter
  protected int               maxReturn = 10000;
  
  public SqlQueryParams() { }
  
  public SqlQueryParams(String exp) { 
    addSearchTerm("search", exp);
  }
  
  
  public SqlQueryParams(Map<String, SearchFilter> filters, 
                        Map<String, OptionFilter> optionFilters,  Map<String, RangeFilter>  rangeFilters, 
                        OrderBy orderBy, int maxReturn) {
    if(filters != null) {
      for(SearchFilter sel : filters.values()) {
        add(sel.paramClone());
      }
    }
    if(optionFilters != null) {
      for(OptionFilter sel : optionFilters.values()) {
        add(sel);
      }
    }
    
    if(rangeFilters != null) {
      for(RangeFilter sel : rangeFilters.values()) {
        add(sel);
      }
    }
    this.orderBy   = orderBy;
    this.maxReturn = maxReturn;
  }
  
  public SqlQueryParams addSearchTerm(String name, String exp) {
    FILTER(new SearchFilter(name).value(exp));
    return this;
  }
  
  public boolean hasParam(String name) {
    if(params == null) return false;
    Object val = params.get(name);
    if(val == null) return false;
    if(val instanceof String) {
      return !StringUtil.isEmpty((String) val);
    }
    return true;
  }
  
  public SqlQueryParams addParam(String name, Object value) {
    if(params == null) params = new MapObject();
    if(value == null) {
      params.remove(name);
    } else {
      params.put(name, value);
    }
    return this;
  }

  public SqlQueryParams FILTER(FieldFilter ... filter) {
    for(FieldFilter sel : filter) {
      if(sel instanceof RangeFilter) {
        add((RangeFilter)sel);
      } else if(sel instanceof OptionFilter) {
        add((OptionFilter)sel);
      }
    }
    return this;
  }

  public SqlQueryParams FILTER(SearchFilter  ... filter) {
    for(SearchFilter sel : filter) {
      add(sel);
    }
    return this;
  }
  
  
  public SqlQueryParams ORDERBY(String selectedField, String order) {
    this.orderBy = new OrderBy(null, selectedField, order);
    return this;
  }
  
  public SqlQueryParams ORDERBY(String[] fields, String selectedField, String order) {
    this.orderBy = new OrderBy(fields, selectedField, order);
    return this;
  }
  
  public List<SearchFilter> getFilters() { 
    if(filters == null) return null;
    return new ArrayList<>(filters.values()); 
  }

  public void setFilters(List<SearchFilter> filters) { 
    if(filters == null) {
      this.filters = null;
    } else {
      this.filters = new LinkedHashMap<>();
      for(SearchFilter sel : filters) {
        this.filters.put(sel.getName(), sel);
      }
    }
  }

  public List<OptionFilter> getOptionFilters() {
    if(optionFilters == null) return null;
    return new ArrayList<>(optionFilters.values()); 
  }

  public void setOptionFilters(List<OptionFilter> filters) {
    if(filters == null) {
      this.optionFilters = null;
    } else {
      this.optionFilters = new LinkedHashMap<>();
      for(OptionFilter sel : filters) {
        this.optionFilters.put(sel.getName(), sel);
      }
    }
  }
  
  public List<RangeFilter> getRangeFilters() {
    if(rangeFilters == null) return null;
    return new ArrayList<>(rangeFilters.values()); 
  }

  public void setRangeFilters(List<RangeFilter> filters) {
    if(filters == null) {
      this.rangeFilters = null;
    } else {
      this.rangeFilters = new LinkedHashMap<>();
      for(RangeFilter sel : filters) {
        this.rangeFilters.put(sel.getName(), sel);
      }
    }
  }
  
  public SqlQueryParams add(SearchFilter filter) {
    if(filters == null) filters = new LinkedHashMap<>();
    filters.put(filter.getName(), filter);
    return this;
  }
  
  public SqlQueryParams add(OptionFilter filter) {
    if(optionFilters == null) optionFilters = new LinkedHashMap<>();
    optionFilters.put(filter.getName(), filter);
    return this;
  }
  
  public SqlQueryParams add(RangeFilter filter) {
    if(rangeFilters == null) rangeFilters = new LinkedHashMap<>();
    rangeFilters.put(filter.getName(), filter);
    return this;
  }
}
