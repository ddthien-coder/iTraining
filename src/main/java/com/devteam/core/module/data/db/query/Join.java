package com.devteam.core.module.data.db.query;

import com.devteam.core.util.ds.Arrays;
import com.devteam.core.util.ds.Collections;
import lombok.Getter;

import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Join {
  String   type;
  Class<?> entity;
  String   table;
  String   join;
  
  @Getter
  private List<SelectField> selectFields ;
  
  @Getter
  private List<ParamFilter> paramFilters;
  
  public <T>  Join(String type, Class<T> entity) {
    this.type = type;
    this.entity = entity;
    this.table = entity.getDeclaredAnnotation(Table.class).name();
  }
  
  public <T>  Join(String type, String table) {
    this.type  = type;
    this.table = table;
  }
  
  public Join FILTER(ParamFilter ... filter) {
    paramFilters = Arrays.addToList(paramFilters, filter);
    return this;
  }
  
  public Join addSelectField(String fieldName, String alias) {
    return addSelectField(null, fieldName, alias);
  }
  
  public Join addSelectField(SqlFunction func, String fieldName, String alias) {
    if(Objects.isNull(selectFields)) {
      selectFields = new ArrayList<>();
    }
    String fieldExpression = null;
    if(entity == null) {
      fieldExpression =  SqlUtil.createFieldExpression(table, fieldName);
    } else {
      fieldExpression = SqlUtil.createFieldExpression(entity, fieldName);
    }
    selectFields.add(new SelectField(func, fieldExpression, alias));
    return this;
  }
  
  public Join ON(String field, Class<?> joinEntity, String joinField) {
    join = SqlUtil.createFieldExpression(entity, field) + " = " + SqlUtil.createFieldExpression(joinEntity, joinField) ;
    return this;
  }
  
  public Join ON(String field, String joinTable, String joinField) {
    join = SqlUtil.createFieldExpression(table, field) + " = " + SqlUtil.createFieldExpression(joinTable, joinField) ;
    return this;
  }
  
  public Join AND(String field, String op, String exp) {
    field = SqlUtil.createFieldExpression(entity, field);
    join += " AND " + field + " " + op + " " + exp;
    return this;
  }
  
  public String createJoin(SqlQuery query) {
    if(Collections.isNotEmpty(paramFilters)) {
      for(ParamFilter sel : paramFilters) {
        if(sel.isApply(query)) {
          join += " AND " + sel.getClause();
        }
      }
    }
    return type + " " + table + " ON " + join ;
  }
}