package com.devteam.core.module.data.db.entity;

import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;

import com.devteam.core.util.text.DateUtil;
import com.devteam.core.util.text.StringUtil;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@JsonInclude(Include.NON_NULL)
public class EntityAttribute extends PersistableEntity<Long> {
  private static final long serialVersionUID = 1L;

  static public enum Type { String, StringArray, Integer, Long, Float, Double, Boolean, Date }

  @Getter @Setter
  @Column(name = "group_name")
  private String groupName;
  
  @NotNull
  @Getter @Setter
  private String name;
  
  @NotNull
  @Getter @Setter
  private Type   type = Type.String;
  
  @Getter @Setter
  @Column(length = 65536)
  private String value;
  
  @Getter @Setter
  @Column(length = 65536)
  private String description;

  public EntityAttribute() { }

  public EntityAttribute(String name, Object val) {
    this(name, val, null);
  }

  public EntityAttribute(String name, Object val, String desc) {
    this.name = name;
    this.description = desc;
    withNewValue(val);
  }
  
  public EntityAttribute(String name, Type type, Object val, String desc) {
    this.name = name;
    this.description = desc;
    this.type = type;
    withNewValue(val);
  }
  
  public Class<?> valueType() {
    if(type == Type.String) return String.class;
    else if(type == Type.StringArray) return String[].class;
    else if(type == Type.Integer) return Integer.class;
    else if(type == Type.Long) return Long.class;
    else if(type == Type.Float) return Float.class;
    else if(type == Type.Double) return Double.class;
    else if(type == Type.Boolean) return Boolean.class;
    else if(type == Type.Date) return Date.class;
    return String.class;
  }

  public Object valueAsType() {
    if(type == Type.String) return value;
    else if(type == Type.StringArray) return StringUtil.toStringArray(value);
    else if(type == Type.Integer) return Integer.parseInt(value);
    else if(type == Type.Long) return Long.parseLong(value);
    else if(type == Type.Float) return Float.parseFloat(value);
    else if(type == Type.Double) return Double.parseDouble(value);
    else if(type == Type.Boolean) return Boolean.parseBoolean(value);
    else if(type == Type.Date) return DateUtil.parseLocalDateTime(value);
    return value;
  }

  public void withNewValue(Object val) {
    if(val == null || val instanceof String) {
      value = (String) val;
      type = Type.String;
    } else if(val instanceof String[]) {
      value = StringUtil.joinStringArray((String[]) val);
      type = Type.StringArray;
    } else if(val instanceof Integer) {
      value = Integer.toString((Integer) val);
      type = Type.Integer;
    } else if(val instanceof Long) {
      value = Long.toString((Long) val);
      type = Type.Long;
    } else if(val instanceof Float) {
      value = Float.toString((Float) val);
      type = Type.Float;
    } else if(val instanceof Double) {
      value = Double.toString((Double) val);
      type = Type.Double;
    } else if(val instanceof Boolean) {
      value = Boolean.toString((Boolean) val);
      type = Type.Boolean;
    } else if(val instanceof Date) {
      value = DateUtil.asLocalDateTime((Date) val);
      type = Type.Date;
    } else {
      throw new RuntimeException("unknown value type " + val);
    }
  }
  
  public void withValue(Object val) {
    if(val == null) {
      this.value = null;
      return;
    }
    if(type == null) {
      withNewValue(val);
      return;
    }
    if(type == Type.String && val instanceof String) value = (String) val;
    else if(type == Type.StringArray && val instanceof String[]) value = StringUtil.joinStringArray((String[]) val);
    else if(type == Type.Integer && val instanceof Integer) value = Integer.toString((Integer) val);
    else if(type == Type.Long && val instanceof Long) value = Long.toString((Long) val);
    else if(type == Type.Float && val instanceof Float) value = Float.toString((Float) val);
    else if(type == Type.Double && val instanceof Double) value = Double.toString((Double) val);
    else if(type == Type.Boolean && val instanceof Boolean) value = Boolean.toString((Boolean) val);
    else if(type == Type.Date && val instanceof Date) value = DateUtil.asLocalDateTime((Date) val);
    else throw new RuntimeException("not support type for " + val);
  }
  
  public void merge(EntityAttribute other) {
    groupName = other.groupName;
    name      = other.name;
    value     = other.value;
    if(other.description != null) description = other.description;
  }
  
  static public void save(Map<String, EntityAttribute> map, String name, Object value, String desc) {
    EntityAttribute attr = map.get(name);
    if(attr == null) {
      attr = new EntityAttribute(name, value, desc);
      map.put(attr.getName(), attr);
    } else {
      attr.withValue(value);
    }
  }

  static public <T extends EntityAttribute> void addTo(List<T> holder, T ref) {
    Iterator<T> i = holder.iterator();
    while(i.hasNext()) {
      T sel = i.next();
      if(sel.getName().equals(ref.getName())) {
        if(ref.getValue() == null) {
          i.remove();
        } else {
          sel.merge(ref);
        }
      }
    }
    if(ref.getValue() != null) {
      holder.add(ref);
    }
  }
}