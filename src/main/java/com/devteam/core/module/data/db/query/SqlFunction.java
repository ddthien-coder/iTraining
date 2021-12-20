package com.devteam.core.module.data.db.query;

public interface SqlFunction {
  public String createExpression(SelectField ...fields);

  static public class Count implements SqlFunction {
    @Override
    public String createExpression(SelectField... fields) {
      StringBuilder b = new StringBuilder();
      b.append("count(");
      for(int i = 0; i < fields.length; i++) {
        if(i > 0) b.append(", ");
        b.append(fields[i].getFieldExpression());
      }
      b.append(")");
      return b.toString();
    }
  }
  
  static public class Sum implements SqlFunction {
    @Override
    public String createExpression(SelectField... fields) {
      StringBuilder b = new StringBuilder();
      b.append("sum(");
      for(int i = 0; i < fields.length; i++) {
        if(i > 0) b.append(", ");
        b.append(fields[i].getFieldExpression());
      }
      b.append(")");
      return b.toString();
    }
  }
}
