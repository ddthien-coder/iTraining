package com.devteam.core.module.data.db;

import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class SqlRecord {
  @Getter @Setter
  private String[] fields;
  
  @Getter @Setter
  private Object[] values;
  
  public SqlRecord() {
  }
  
  public SqlRecord(String[] fields) {
    this.fields = fields;
    this.values = new Object[fields.length];
  }
  
  public SqlRecord(String[] fields, Object[] values) {
    this.fields = fields;
    this.values = values;
  }
  
  public Object get(String fieldName) {
    for(int i = 0; i < fields.length; i++) {
      if(fieldName.equals(fields[i])) return values[i];
    }
    throw new RuntimeException("Cannot find the custom " + fieldName);
  }
  
  public String getAsString(String fieldName) { 
    Object val = get(fieldName); 
    if(val == null) return null;
    if(val instanceof String) return (String) val;
    return val.toString();
  }
  
  public Integer getAsInteger(String fieldName) { return (Integer) get(fieldName); }
  
  public Long getAsLong(String fieldName) { 
    Object obj = get(fieldName); 
    if(obj instanceof Integer) {
      return ((Integer)obj).longValue();
    }
    return (Long) obj;
  }
  
  public Double getAsDouble(String fieldName) { 
    Object obj = get(fieldName); 
    if(obj == null) return 0d;
    
    if(obj instanceof Double) {
      return ((Double)obj).doubleValue();
    }
    return (Double) obj;
  }
  
  public Date getAsDate(String fieldName) { return (Date) get(fieldName); }
  
  public void dump() {
    for(int i = 0; i < fields.length; i++) {
      System.out.println(fields[i] + ":" + values[i]);
    }
  }
  
  static public String[] getAsString(List<SqlRecord> entities, String fieldName) {
    String[] value = new String[entities.size()];
    for(int i = 0; i < value.length; i++) {
      value[i] = entities.get(i).getAsString(fieldName);
    }
    return value;
  }
  
  static public Long[] getAsLong(List<SqlRecord> entities, String fieldName) {
    Long[] value = new Long[entities.size()];
    for(int i = 0; i < value.length; i++) {
      value[i] = entities.get(i).getAsLong(fieldName);
    }
    return value;
  }
}
