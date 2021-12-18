package com.ddthien.itraining.core.data;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.ApplicationContext;

public class DataDB {
    static DataDB instance = null ;

    private ApplicationContext    context;
    Map<String, Object>      dataMap    = new HashMap<>();

    private DataDB(ApplicationContext context) {
        this.context = context;
    }

    public <T> T getData(Class<T> type) {
        T data = (T) dataMap.get(type.getName());
        if(data == null) {
            data = context.getAutowireCapableBeanFactory().createBean(type);
            dataMap.put(type.getName(), data);
        }
        return data ;
    }

    static public void initDataDB(ApplicationContext context) {
        instance = new DataDB(context);
    }

    static public void clearDataDB() {
        instance = null;
    }

    static public DataDB getInstance() { return instance ; }
}
