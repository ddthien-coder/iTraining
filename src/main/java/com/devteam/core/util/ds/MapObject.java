package com.devteam.core.util.ds;

import com.devteam.core.util.text.DateUtil;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;


public class MapObject extends LinkedHashMap<String, Object> {
  private static final long serialVersionUID = 1L;

  public MapObject() {}
  
  public MapObject(String key, Object val) {
    put(key, val);
  }
  
  public MapObject(String key1, Object val1, String key2, Object val2) {
    put(key1, val1);
    put(key2, val2);
  }

  public void putAll(Properties props) {
    for(Map.Entry<Object, Object> entry : props.entrySet()) {
      put((String) entry.getKey(), entry.getValue());
    }
  }
  
  @SuppressWarnings("unchecked")
  public <T> T get(Class<T> type) {
    return (T) get(type.getName());
  }
  
  public <T> void put(T obj) {
    put(obj.getClass().getName(), obj);
  }
  
  public <T> void put(Class<T> type, T obj) {
    put(type.getName(), obj);
  }
  
  public MapObject add(String name, Object val) {
    put(name, val);
    return this;
  }
  
  public MapObject add(Object name, Object val) {
    put(name.toString(), val);
    return this;
  }

  @SuppressWarnings("unchecked")
  public <T> T remove(Class<T> type) {
    return (T)remove(type.getName());
  }
  
  public String getString(String name, String defaultVal) {
    Object val = get(name);
    if(val == null) return defaultVal;
    if(val instanceof String) return (String) val;
    return val.toString();
  }
  
  public Double getDouble(String name, Double defaultVal) {
    Object val = get(name);
    if(val == null) return defaultVal;
    if(val instanceof Double || val instanceof Float || 
       val instanceof Integer || val instanceof Long) {
      return (Double)val;
    } else if(val instanceof String) {
      return Double.parseDouble((String) val);
    }
    throw new RuntimeException(val + " is not a double number");
  }

  public Float getFloat(String name, Float defaultVal) {
    Object val = get(name);
    if(val == null) return defaultVal;
    if(val instanceof Double || val instanceof Float || 
       val instanceof Integer || val instanceof Long) {
      return (Float)val;
    } else if(val instanceof String) {
      return Float.parseFloat((String) val);
    }
    throw new RuntimeException(val + " is not a float number");
  }

  public Long getLong(String name, Long defaultVal) {
    Object val = get(name);
    if(val == null) return defaultVal;
    if(val instanceof Integer) {
      return ((Integer) val).longValue();
    } else if(val instanceof Long) {
      return (Long)val;
    } else if(val instanceof String) {
      return Long.parseLong((String) val);
    }
    throw new RuntimeException(val + " is not a long number");
  }

  public Integer getInteger(String name, Integer defaultVal) {
    Object val = get(name);
    if(val == null) return defaultVal;
    if(val instanceof Integer || val instanceof Long) {
      return (Integer)val;
    } else if(val instanceof String) {
      return Integer.parseInt((String) val);
    }
    throw new RuntimeException(val + " is not an integer number");
  }

  public Date getDate(String name, Date defaultVal) {
    Object val = get(name);
    if(val == null) return defaultVal;
    if(val instanceof Date) {
      return (Date)val;
    } else if(val instanceof String) {
      return DateUtil.parseCompactDate((String) val);
    }
    throw new RuntimeException(val + " is not a date");
  }

  public Boolean getBoolean(String name, Boolean defaultVal) {
    Object val = get(name);
    if(val == null) return defaultVal;
    if(val instanceof Boolean) {
      return (Boolean)val;
    } else if(val instanceof String) {
      return Boolean.parseBoolean((String) val);
    }
    throw new RuntimeException(val + " is not a boolean");
  }
}
