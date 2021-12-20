package com.devteam.core.util.bean;

import java.util.Date;

public class ClassUtil {
  static public boolean isNumberType(Class<?> type) {
    if(type == Integer.class || type == Long.class || type == Short.class || 
       type == Float.class || type == Double.class) {
      return true ;
    }
    return false ;
  }
  
  static public boolean isSqlType(Class<?> type) {
    if(type.isPrimitive()) return true;
    if(type.isEnum()) return true;
    if(type == String.class) return true;
    if(type == Date.class) return true;
    if(type == Integer.class || type == Long.class || type == Short.class || 
       type == Float.class || type == Double.class) {
      return true ;
    }
    if(type == Byte.class) return true;
    return false ;
  }
}
