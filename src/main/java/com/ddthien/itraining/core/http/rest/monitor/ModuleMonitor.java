package com.ddthien.itraining.core.http.rest.monitor;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import com.ddthien.itraining.core.http.RestResponseError;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

public class ModuleMonitor implements Serializable  {
    private static final long serialVersionUID = 1L;

    @Getter @Setter
    private String                      module;

    @Getter @Setter
    private int                         requestCount;

    @Getter @Setter
    private int                         errorCount;

    @Getter @Setter
    private Map<String, ServiceMonitor> services            = new HashMap<String, ServiceMonitor>();

    public ModuleMonitor() { }

    public ModuleMonitor(String module) {
        this.module = module;
    }

    synchronized public void onRequest(String sName, String endpoint, long receivedAt, long finishedAt, RestResponseError err) {
        requestCount++ ;
        if(err != null) errorCount++ ;
        ServiceMonitor service = services.get(sName) ;
        if(service == null) {
            service = new ServiceMonitor(sName) ;
            services.put(service.getService(), service) ;
        }
        service.onRequest(endpoint, receivedAt, finishedAt, err) ;
    }

    @JsonIgnore
    public long getMaxExecTime() {
        long max = 0 ;
        for(ServiceMonitor sel : services.values()) {
            if(sel.getMaxExecTime() > max) max  = sel.getMaxExecTime() ;
        }
        return max ;
    }

    @JsonIgnore
    public long getAvgExecTime() {
        if(this.requestCount == 0) return 0 ;
        return getSumExecTime()/requestCount;
    }

    @JsonIgnore
    public long getSumExecTime() {
        long sum = 0 ;
        for(ServiceMonitor sel : services.values()) {
            sum  += sel.getSumExecTime() ;
        }
        return sum ;
    }
}
