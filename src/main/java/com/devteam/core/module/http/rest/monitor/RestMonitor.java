package com.devteam.core.module.http.rest.monitor;

import java.util.HashMap;
import java.util.Map;

import com.devteam.core.module.http.rest.RestResponseError;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class RestMonitor {
  private Map<String, ModuleMonitor> modules = new HashMap<String, ModuleMonitor>() ;

  public Map<String, ModuleMonitor> getModules() { return modules; }
  public void setModules(Map<String, ModuleMonitor> modules) { this.modules = modules; }

  synchronized public void onRequest(String mName, String sName, String endpoint, long receivedAt, long finishedAt, RestResponseError err) {
    if(mName == null) mName = "rest";
    ModuleMonitor module = modules.get(mName) ;
    if(module == null) {
      synchronized(modules) {
        module = modules.get(mName) ;
        if(module == null) {
          module = new ModuleMonitor(mName) ;
          modules.put(mName, module) ;
        }
      }
    }
    module.onRequest(sName, endpoint, receivedAt, finishedAt, err) ;
  }
  
  @JsonIgnore
  public int getTotalCall() {
    int total = 0 ;
    for(ModuleMonitor sel : modules.values()) total += sel.getRequestCount() ;
    return total ;
  }
  
  @JsonIgnore
  public int getTotalError() {
    int total = 0 ;
    for(ModuleMonitor sel : modules.values()) total += sel.getErrorCount() ;
    return total ;
  }
  
  @JsonIgnore
  public long getMaxExecTime() {
    long max = 0;
    for(ModuleMonitor sel : modules.values()) {
      if(sel.getMaxExecTime() > max) max  = sel.getMaxExecTime() ;
    }
    return max ;
  }
  
  @JsonIgnore
  public long getAvgExecTime() {
    long sum = 0;
    int request  = 0 ;
    for(ModuleMonitor sel : modules.values()) {
      sum += sel.getSumExecTime() ;
      request += sel.getRequestCount() ;
    }
    if(request == 0) return 0 ;
    return sum/request ;
  }
}