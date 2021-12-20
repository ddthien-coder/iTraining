package com.devteam.core.util.bean;

import lombok.extern.slf4j.Slf4j;

import java.beans.*;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.*;

@Slf4j
public class BeanInspector<T> {
  static Object[] EMPTY_ARGS = new Object[0] ;
  static WeakHashMap<String, BeanInspector> inspectors = new WeakHashMap<String, BeanInspector>() ;
  
  private Map<String, Field> fields = new HashMap<String, Field>() ;
  private Map<String, PropertyDescriptor> pdescriptors = new HashMap<String, PropertyDescriptor>() ;
  private Map<String, MethodDescriptor>   mdescriptors = new HashMap<String, MethodDescriptor>() ;
  private Class<T> type ;
  
  public BeanInspector(Class<T> type) {
    this.type  = type ;
    try {
      BeanInfo info = Introspector.getBeanInfo(type);
     
      for(PropertyDescriptor sel : info.getPropertyDescriptors()) {
        pdescriptors.put(sel.getName(), sel) ;
      }
      
      for(MethodDescriptor sel : info.getMethodDescriptors()) {
        String name = sel.getMethod().getName() ;
        Class<?>[] pTypes = sel.getMethod().getParameterTypes() ;
        mdescriptors.put(name + ":" + pTypes.length, sel) ;
      }
      addDeclaredFields(type);
    } catch (IntrospectionException e) {
      throw new RuntimeException(e) ;
    }
  }
  
  public Class<T> getType() { return type ; }
  
  public Class getPropertyType(String property) {
    try {
      PropertyDescriptor descriptor = pdescriptors.get(property) ;
      return descriptor.getReadMethod().getReturnType() ;
    } catch (Throwable t) {
      throw new RuntimeException(t) ;
    }
  }
  
  public PropertyDescriptor getPropertyDescriptor(String property) {
    PropertyDescriptor descriptor = pdescriptors.get(property) ;
    return descriptor;
  }
  
  public Field getField(String name) { 
    Field field = fields.get(name); 
    if(field == null) {
      log.warn("Cannot find the field " + name);
    }
    return field;
  }
  
  public Set<String> getPropertyNames() {
    return pdescriptors.keySet() ;
  }

  public Collection<PropertyDescriptor> getPropertyDescriptors() {
    return pdescriptors.values() ;
  }
  
  public boolean isPropertyNumberType(String property) {
    Class<?> type = getPropertyType(property) ;
    return ClassUtil.isNumberType(type) ;
  }

  public boolean isSqlType(PropertyDescriptor descriptor) {
    if("id".equals(descriptor.getName())) return true;
    if("new".equals(descriptor.getName())) return false;
    if("editState".equals(descriptor.getName())) return false;
    if("loadState".equals(descriptor.getName())) return false;
    Class<?> type = descriptor.getReadMethod().getReturnType();
    return ClassUtil.isSqlType(type);
  }
  
  public Object getValue(T target, String property) {
    try {
      PropertyDescriptor descriptor = pdescriptors.get(property) ;
      return descriptor.getReadMethod().invoke(target, EMPTY_ARGS) ;
    } catch (Throwable t) {
      t.printStackTrace() ;
      throw new RuntimeException(t) ;
    } 
  }
  
  public void setValue(T target, String property, Object value) throws Exception {
    PropertyDescriptor descriptor = pdescriptors.get(property) ;
    descriptor.getWriteMethod().invoke(target, new Object[] { value }) ;
  }
  
  public void setProperties(T target, Map<String, Object> properties) throws Exception {
    if(properties == null || properties.size() == 0) return ;
    for(Map.Entry<String, Object> entry : properties.entrySet()) {
      setValue(target, entry.getKey(), entry.getValue()) ;
    }
  }

  public Object call(T target, String methodName, Object[] args) throws Exception {
    String methodId = methodName + ":" + args.length ;
    MethodDescriptor descriptor = mdescriptors.get(methodId) ;
    Method method = descriptor.getMethod() ;
    return method.invoke(target, args) ;
  }
  
  public T newInstance() throws InstantiationException, IllegalAccessException { 
    return type.newInstance() ;
  }
  
  public T newInstance(Map<String, Object> properties) throws Exception { 
    T instance = type.newInstance() ;
    setProperties(instance, properties) ;
    return instance ;
  }
  
  static public <T> BeanInspector get(Class<T> type) {
    BeanInspector inspector = inspectors.get(type.getName()) ;
    if(inspector == null) {
      inspector = new BeanInspector<T>(type) ;
      inspectors.put(type.getName(), inspector) ;
    }
    return inspector ;
  }
  
  private void addDeclaredFields(Class<?> type) {
    for(Field sel : type.getDeclaredFields()) {
      this.fields.put(sel.getName(), sel);
    }
    if(type.getSuperclass() != null) {
      addDeclaredFields(type.getSuperclass()) ;
    }
  }
}
