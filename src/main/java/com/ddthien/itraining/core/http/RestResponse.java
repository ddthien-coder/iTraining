package com.ddthien.itraining.core.http;

import java.util.ArrayList;
import java.util.List;

import com.ddthien.itraining.lib.util.DataSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @Getter @Setter
public class RestResponse {
    static public enum Status { OK, NOT_AUTHORIZED, ERROR }

    private long           receivedAtTime;
    private long           finishedAtTime;
    private long           executionTime;
    private String         module;
    private String         service;
    private String         method;
    private String         data;
    private List<String>   logs;
    private Status         status = Status.OK;
    private RestResponseError  error;

    public RestResponse(String module, String service, String method) {
        this.module = module;
        this.service = service;
        this.method = method;
    }

    @JsonIgnore
    public <T> T getDataAs(Class<T> type) {
        if(error != null) {
            throw new RuntimeException(error.getMessage() + "\n" + error.getStacktrace()) ;
        }
        if(data == null) return null ;
        return DataSerializer.JSON.fromString(data, type);
    }

    @JsonIgnore
    public <T> List<T> getDataAs(TypeReference<List<T>> tref) {
        if(error != null) {
            throw new RuntimeException(error.getMessage() + "\n" + error.getStacktrace()) ;
        }
        return DataSerializer.JSON.fromStringToList(data, tref);
    }

    @JsonIgnore
    public <T> void setDataAs(T obj) {
        if(obj == null) data = null;
        else  data = DataSerializer.JSON.toString(obj);
    }

    public void addLog(String log) {
        if(logs == null) logs = new ArrayList<String>() ;
        logs.add(log) ;
    }


    public void withError(String source, Throwable t) {
        status = Status.ERROR;
        this.error = new RestResponseError(source, t);
    }

    public RestResponse withFinishedAtTime(long atTime) {
        this.finishedAtTime = atTime;
        this.executionTime = atTime - receivedAtTime;
        return this;
    }
}