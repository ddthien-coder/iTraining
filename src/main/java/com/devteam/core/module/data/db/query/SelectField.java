package com.devteam.core.module.data.db.query;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Getter;
import lombok.Setter;

@JsonInclude(Include.NON_NULL)
public class SelectField {
  @Getter @Setter
  private String fieldExpression;

  @Getter @Setter
  private String alias;

  @Getter @Setter
  private SqlFunction sqlFunction;

  public SelectField() {}

  public SelectField(String fieldName) {
    this.fieldExpression = fieldName;
    this.alias = fieldName;
  }
  public SelectField(String fieldExp, String alias) {
    this.fieldExpression = fieldExp;
    this.alias = alias;
  }

  public SelectField(SqlFunction function, String fieldExp, String alias) {
    this(fieldExp, alias);
    this.sqlFunction = function;
  }

  public String createSelectExpression() {
    if(sqlFunction == null) {
      return fieldExpression + " AS " + alias;
    }
    return sqlFunction.createExpression(this) + " AS " + alias;
  }
}
