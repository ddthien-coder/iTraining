package com.ddthien.itraining.lib.util.reflection;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

public class BeanUtil<T> {
    private Class<T> type;
    private Map<String, Constructor<T>> constructors = new HashMap<>();
    private Map<String, Method> methods = new HashMap<>();
    private Map<String, Field> fields = new HashMap<>();

    public BeanUtil(Class<T> type) {
        this.type = type;
    }

    public T create() throws Exception {
        Constructor<T> constructor = findConstructor();
        initMethods();
        initField();
        return constructor.newInstance();
    }

    public T create(Object... params) throws Exception {
        Constructor<T> constructor = findConstructor(params);
        initMethods();
        initField();
        return constructor.newInstance(params);
    }

    Constructor<T> findConstructor(Object... params) throws Exception {
        StringBuilder keyB = new StringBuilder();
        if (params != null) {
            for (int i = 0; i < params.length; i++) {
                if (i > 0)
                    keyB.append("|");
                keyB.append(params[i].getClass().getName());
            }
        }
        String key = keyB.toString();

        Constructor<T> constructor = constructors.get(key);

        if (constructor == null) {
            Class<?>[] paramTypes = new Class[params.length];
            for (int i = 0; i < params.length; i++) {
                if (params[i] instanceof Integer) {
                    paramTypes[i] = Integer.TYPE;
                } else if (params[i] instanceof String) {
                    paramTypes[i] = String.class;
                }
            }
            constructor = type.getConstructor(paramTypes);
            constructors.put(key, constructor);
        }
        return constructor;
    }

    public void initMethods() {
        Method[] arr = type.getMethods();
        for (Method detail : arr) {
            methods.put(detail.getName(), detail);
        }
    }

    public void initField() {
        Field[] arr = type.getDeclaredFields();
        for (Field detail : arr) {
            // System.out.println(detail.getName());
            fields.put(detail.getName(), detail);
        }
    }

    public Object invoke(String method, Object target) throws Exception {
        Method result = methods.get(method);
        return result.invoke(target);
    }

    public <T> T getFieldValue(String fieldName, Object target) throws Exception {
        Field field = fields.get(fieldName);
        field.setAccessible(true);
        return (T) field.get(target);
    }

    public void setFieldValue(String fieldName, Object target, Object value) throws Exception {
        Field field = fields.get(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    public Object invoke(String method, Object target, Object[] params) throws Exception {
        Class<?> paramType[] = new Class[params.length];
        for (int i = 0; i < params.length; i++) {
            if (params[i] instanceof Integer) {
                paramType[i] = Integer.TYPE;
            } else if (params[i] instanceof String) {
                paramType[i] = String.class;
            }
        }
        Method result = methods.get(method);
        return result.invoke(target, params);
    }
}

