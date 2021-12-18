package com.ddthien.itraining.lib.util.reflection;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ReflectionUtil {
    static public Object invoke(String method, Object target) throws Exception {
        Method result = target.getClass().getMethod(method);
        return result.invoke(target);
    }

    static public Object invoke(String method, Object target, Object[] params) throws Exception {
        Class<?> paramType[] = new Class[params.length];
        for (int i = 0; i < params.length; i++) {
            if (params[i] instanceof Integer) {
                paramType[i] = Integer.TYPE;
            } else if (params[i] instanceof String) {
                paramType[i] = String.class;
            }
        }
        Method result = target.getClass().getMethod(method, paramType);
        return result.invoke(target, params);
    }

    static public <T> T create(Class<T> type) throws Exception {
        return type.newInstance();
    }

    static public <T> T create(Class<T> type, Object[] params) throws Exception {
        Class<?> paramType[] = new Class[params.length];
        for (int i = 0; i < params.length; i++) {
            if (params[i] instanceof Integer) {
                paramType[i] = Integer.TYPE;
            } else if (params[i] instanceof String) {
                paramType[i] = String.class;
            }
        }
        return type.getConstructor(paramType).newInstance(params);
    }

    @SuppressWarnings("unchecked")
    static public <T> T getFieldValue(String fieldName, Object target) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return (T) field.get(target);
    }

    static public void setFieldValue(String fieldName, Object target, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }
}

