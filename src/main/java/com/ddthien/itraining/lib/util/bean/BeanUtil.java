package com.ddthien.itraining.lib.util.bean;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.apache.commons.beanutils.BeanUtils;

public class BeanUtil {
    static public <T> void copyProperties(T dest, T src) {
        try {
            BeanUtils.copyProperties(dest, src);
        } catch(Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static <T> void copyAllFields(T dest, T src) {
        Class<T> clazz = (Class<T>) src.getClass();
        List<Field> fields = getAllModelFields(clazz);
        copyAllFields(dest, src, fields);
    }

    public static <T> void copyAllFields(T dest, T src, List<Field> fields) {
        if (fields != null) {
            for (Field field : fields) {
                try {
                    field.setAccessible(true);
                    field.set(dest,field.get(src));
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    static public List<Field> getAllModelFields(Class aClass) {
        List<Field> fields = new ArrayList<>();
        do {
            Collections.addAll(fields, aClass.getDeclaredFields());
            aClass = aClass.getSuperclass();
        } while (aClass != null);
        return fields;
    }

    static public List<Field> getFields(Class aClass) {
        List<Field> fields = new ArrayList<>();
        Collections.addAll(fields, aClass.getDeclaredFields());
        return fields;
    }
}

