package com.ddthien.itraining.lib.util.bean;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.beanutils.PropertyUtils;

public interface BeanGetterSetter {
    public <T> Object getValue(T target, String property);
    public <T> void   setValue(T target, String property, Object value);

    public <T> Class<?> getPropertyType(String property);

    static public class ReflectionBeanGetterSetter implements BeanGetterSetter {
        private Map<String, GetterSetter> properties = new HashMap<String, GetterSetter>();

        public ReflectionBeanGetterSetter(Object sampleBean) {
            Class<?> clazz = sampleBean.getClass();
            while (clazz != null && clazz != Object.class) {
                for(Field field : clazz.getDeclaredFields()) {
                    String property = field.getName();
                    findGetterSetter(sampleBean, property);
                }
                clazz = clazz.getSuperclass();
            }
        }

        public ReflectionBeanGetterSetter(Object sampleBean, String[] properties) {
            init(sampleBean, properties);
        }

        void init(Object sampleBean, String[] properties) {
            for(int i = 0; i < properties.length; i++) {
                String property = properties[i];
                findGetterSetter(sampleBean, property);
            }
        }

        public GetterSetter findGetterSetter(Object target, String property) {
            GetterSetter getterSetter = properties.get(property);
            if(getterSetter != null) return getterSetter;
            try {
                PropertyDescriptor descriptor = PropertyUtils.getPropertyDescriptor(target, property);
                if(descriptor == null) {
                    getterSetter = new FieldGetterSetter(target.getClass(), property);
                } else {
                    getterSetter = new PropertyDescriptorGetterSetter(property, descriptor);
                }
            } catch (NoSuchFieldException | SecurityException e) {
                getterSetter = new GetterSetter(property);
            } catch(NoSuchMethodException | IllegalAccessException | InvocationTargetException ex) {
                try {
                    getterSetter = new FieldGetterSetter(target.getClass(), property);
                } catch (NoSuchFieldException | SecurityException e) {
                    getterSetter = new GetterSetter(property);
                }
            }
            properties.put(property, getterSetter);
            return getterSetter;
        }


        @Override
        public <T> Object getValue(T target, String property) {
            try {
                GetterSetter getterSetter = findGetterSetter(target, property);
                return getterSetter.getValue(target);
            } catch (Exception e) {
                String msg = "target = " + target + ", property = " + property;
                throw new RuntimeException(msg, e);
            }
        }

        @Override
        public <T> void setValue(T target, String property, Object value) {
            try {
                GetterSetter getterSetter = findGetterSetter(target, property);
                getterSetter.setValue(target, value);
            } catch (Exception e) {
                String msg = "target = " + target + ", property = " + property + ", value = " + value;
                throw new RuntimeException(msg, e);
            }
        }

        @Override
        public <T> Class<?> getPropertyType(String property) {
            try {
                return properties.get(property).getPropertyType();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    static public class MapBeanGetterSetter implements BeanGetterSetter {
        Map<String, Class<?>> propertyTypes = new HashMap<>();

        public MapBeanGetterSetter() { }

        public MapBeanGetterSetter(String[] property, Class<?>[] types) {
            for(int i = 0; i < property.length; i++) {
                propertyTypes.put(property[i], types[i]);
            }
        }

        @Override
        public <T> Object getValue(T target, String property) {
            Map<String, Object> map = (Map<String, Object>) target;
            return map.get(property);
        }

        @Override
        public <T> void setValue(T target, String property, Object value) {
            Map<String, Object> map = (Map<String, Object>) target;
            map.put(property, value);
        }

        @Override
        public <T> Class<?> getPropertyType(String property) {
            Class<?> type = propertyTypes.get(property);
            if(type == null) return Object.class;
            return type;
        }

    }

    static  class GetterSetter {
        protected String property;

        GetterSetter(String property) { this.property = property; }

        public Object getValue(Object bean) throws Exception {
            throw new RuntimeException(property + " is not found");
        }

        public void setValue(Object bean, Object val) throws Exception {
            throw new RuntimeException(property + " is not found");
        }

        public <T> Class<T> getPropertyType() {
            throw new RuntimeException(property + " is not found");
        }
    }

    static class PropertyDescriptorGetterSetter extends GetterSetter {
        PropertyDescriptor descriptor;
        Class<?> propertyType;
        boolean nestedProperty = false;

        PropertyDescriptorGetterSetter(String property, PropertyDescriptor descriptor) {
            super(property);
            this.descriptor = descriptor;
            propertyType = descriptor.getPropertyType();
            nestedProperty = property.indexOf('.') > 0;
        }

        public Object getValue(Object bean) throws Exception {
            if(nestedProperty) {
                return PropertyUtils.getNestedProperty(bean, property);
            } else {
                return descriptor.getReadMethod().invoke(bean);
            }
        }

        public void   setValue(Object bean, Object val) throws Exception {
            if(nestedProperty) {
                PropertyUtils.setNestedProperty(bean, property, val);
            } else {
                descriptor.getWriteMethod().invoke(bean, val);
            }
        }

        public Class<?> getPropertyType() { return propertyType; }
    }

    static class FieldGetterSetter extends GetterSetter {
        private Field field;

        FieldGetterSetter(Class<?> clazz, String property) throws NoSuchFieldException, SecurityException {
            super(property);
            field = clazz.getDeclaredField(property);
            if(field.isAccessible()) {
                throw new SecurityException("Field " + property + " is not accessible");
            }
        }

        public Object getValue(Object bean) throws Exception {
            return field.get(bean);
        }

        public void   setValue(Object bean, Object val) throws Exception {
            field.set(bean, val);
        }

        public Class<?> getPropertyType() { return field.getDeclaringClass(); }
    }
}

