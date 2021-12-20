package com.devteam.core.module.data.db.query;

import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.devteam.core.util.text.StringUtil;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.Setter;

@JsonInclude(Include.NON_NULL)
public class RangeFilter extends FieldFilter {
  @Getter @Setter
  private String     fromValue;
  
  @Getter @Setter
  private String     toValue;
  
  public RangeFilter() {}

  public RangeFilter(String name) {
    super(name);
  }
  
  public RangeFilter(Class<?> entity, String field) {
    super(entity, field, "NA");
    type(FilterType.String);
  }
  
  public RangeFilter required(boolean b) { 
    setRequired(b);
    return this;
  }

  public RangeFilter type(FilterType type) { 
    setFilterType(type);
    return this;
  }
  
  public RangeFilter fromValue(String from) {
    this.fromValue = from;
    return this;
  }

  public RangeFilter toValue(String to) {
    this.toValue = to;
    return this;
  }
  
  public RangeFilter withinValue(String from, String to) {
    this.fromValue = from;
    this.toValue = to;
    return this;
  }
  
  public Object createFromFilterValue() { 
    return SqlUtil.createFilterValue(getFilterType(), getFilterOp(), fromValue) ;
  }
  
  
  public Object toSqlToFilterValue() { 
    return SqlUtil.createFilterValue(getFilterType(), getFilterOp(), toValue) ;
  }
  
  public String createFromFilterExpression() { 
    return getTableField() + " >= " + ":from_" +  getName(); 
  }
  
  public String createToFilterExpression() { 
    return getTableField() + " <= " + ":to_" +  getName(); 
  }
  
  @JsonIgnore
  public boolean isApplied() { return !StringUtil.isEmpty(fromValue) || !StringUtil.isEmpty(toValue); }
  
  public void mergeValue(RangeFilter other) {
    assertSameFilter(other);
    fromValue = other.getFromValue();
    toValue   = other.getToValue();
  }

  static public <T extends PersistableEntity<Long>> RangeFilter createdTime(Class<T> entity) {
    return new RangeFilter(entity,  "createdTime").type(FilterType.Date);
  }

  static public <T extends PersistableEntity<Long>> RangeFilter modifiedTime(Class<T> entity) {
    return new RangeFilter(entity,  "modifiedTime").type(FilterType.Date);
  }

  static public <T extends PersistableEntity<Long>> RangeFilter date(Class<T> entity, String field) {
    return new RangeFilter(entity,  field).type(FilterType.Date);
  }
}