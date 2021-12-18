package com.ddthien.itraining.core.http;

import com.ddthien.itraining.lib.util.DataSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @Getter @Setter
public class RestResponse {
    static public enum Status { OK, NOT_AUTHORIZED, ERROR }

    private String endpoint;
    private String data;
    private Status status = Status.OK;
    private String error;

    public RestResponse(String endpoint) {
        this.endpoint = endpoint;
    }

    @JsonIgnore
    public <T> T getDataAs(Class<T> type) {
        if(error != null) {
            throw new RuntimeException(error) ;
        }
        if(data == null) return null ;
        return DataSerializer.JSON.fromString(data, type);
    }

    @JsonIgnore
    public <T> void setDataAs(T obj) {
        if(obj == null) data = null;
        else  data = DataSerializer.JSON.toString(obj);
    }

    public void withError(String source, String error) {
        status = Status.ERROR;
        this.error = error;
    }
}
