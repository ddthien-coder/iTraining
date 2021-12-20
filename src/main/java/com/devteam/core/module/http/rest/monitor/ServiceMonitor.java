package com.devteam.core.module.http.rest.monitor;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import com.devteam.core.module.http.rest.RestResponseError;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

public class ServiceMonitor implements Serializable  {
  private static final long serialVersionUID = 1L;

  @Getter @Setter
  private String                   service;
  
  @Getter @Setter
  private int                      requestCount;
  
  @Getter @Setter
  private int                      errorCount;
  
  @Getter @Setter
  private Map<String, CallMonitor> calls            = new HashMap<String, CallMonitor>();

  public ServiceMonitor() { }
  
  public ServiceMonitor(String module) {
    this.service = module; 
  }
  
  synchronized public void onRequest(String endpoint, long receivedAt, long finishedAt, RestResponseError err) {
    requestCount++ ;
    if(err != null) errorCount++ ;
    CallMonitor call = calls.get(endpoint) ;
    if(call == null) {
      call = new CallMonitor(endpoint) ;
      calls.put(endpoint, call) ;
    }
    call.onRequest(receivedAt, finishedAt, err) ;
  }
  
  @JsonIgnore
  public long getMaxExecTime() {
    long max = 0 ;
    for(CallMonitor sel : calls.values()) {
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
    for(CallMonitor sel : calls.values()) {
      sum  += sel.getSumExecTime() ;
    }
    return sum ;
  }
}