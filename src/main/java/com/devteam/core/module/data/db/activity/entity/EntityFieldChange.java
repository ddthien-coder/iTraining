package com.devteam.core.module.data.db.activity.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @Getter @Setter
public class EntityFieldChange {
  private String fieldName;
  private String oldValue;
  private String newValue;
  private ChangeAction action = null ;
  
  public EntityFieldChange(ChangeAction action, String fieldName, Object oldValue, Object newValue) {
    this.action = action;
    this.fieldName = fieldName;
    this.oldValue = toStringValue(oldValue);
    this.newValue = toStringValue(newValue);
  }
  
  private String toStringValue(Object value) {
    if(value == null) return null;
    return value.toString();
  }
}
