package com.ddthien.itraining.core.database;

import java.util.LinkedHashMap;
import java.util.Map;

@SuppressWarnings("serial")
public class SqlMapRecord extends LinkedHashMap<String, Object>{

    public SqlMapRecord() {}

    public SqlMapRecord(String[] fields, Object[] values) {
        for(int i = 0; i < fields.length; i++) {
            put(fields[i], values[i]);
        }
    }

    public String getString(String name) { return (String)get(name);}

    public Long getLong(String name) { return (Long)get(name);}

    public Integer getInteger(String name) { return (Integer)get(name);}

    public Double getDouble(String name) { return (Double)get(name);}

    public void dump() {
        for(Map.Entry<String, Object> entry : entrySet()) {
            System.out.println(entry.getKey() + ":" + entry.getValue());
        }
    }
}
