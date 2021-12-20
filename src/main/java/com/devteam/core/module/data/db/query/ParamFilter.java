package com.devteam.core.module.data.db.query;

import lombok.Getter;
import lombok.Setter;

public class ParamFilter {
  @Getter @Setter
  private String clause;
  
  private String variable ;

  public ParamFilter() {
  }

  public ParamFilter(String entity1TableName, String entity1Field, String op, String variable) {
    clause = SqlUtil.createFieldExpression(entity1TableName, entity1Field) + " " + op + " :" + variable;
    this.variable = variable;
  }

  public ParamFilter(Class<?> entity, String field, String op, String variable) {
    clause = SqlUtil.createFieldExpression(entity, field) + " " + op + " :" + variable;
    this.variable = variable;
  }
  
  public boolean isApply(SqlQuery query) {
    return query.hasParam(variable);
  }
}
