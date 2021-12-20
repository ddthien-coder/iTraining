package com.devteam.core.module.http.rest.monitor;

import java.util.HashMap;
import java.util.Map;

import com.devteam.core.module.http.rest.RestResponseError;
import com.devteam.core.util.cipher.MD5;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

public class CallMonitor {
  @Getter @Setter
  private String               method;
  
  @Getter @Setter
  private int                  requestCount;
  
  @Getter @Setter
  private int                  errorCount;
  
  @Getter @Setter
  private long                 maxExecTime;
  
  @Getter @Setter
  private long                 sumExecTime;
  
  @Getter @Setter
  private Map<String, Error> errors = new HashMap<String, Error>();

  public CallMonitor() {}
  
  public CallMonitor(String method) {
    this.method = method ;
  }
  
  public void onRequest(long receivedAt, long finishedAt, RestResponseError err) {
    requestCount++ ;
    long execTime = finishedAt - receivedAt ;
    if(execTime > maxExecTime)  maxExecTime = execTime ;
    sumExecTime +=  execTime ;
    if(err != null) {
      errorCount++ ;
      String stacktrace = err.getStacktrace();
      String key = Error.key(stacktrace);
      Error error = errors.get(key) ;
      if(error == null) {
        error = new Error(err.getMessage(), stacktrace) ;
        errors.put(key, error);
      }
      error.incrCount();
    }
  }

  @JsonIgnore
  public long getAvgExecTime() { 
    if(this.requestCount == 0) return  0 ;
    return sumExecTime/requestCount ;
  } 
  
  static public class Error {
    @Getter @Setter
    private String message;
    
    @Getter @Setter
    private String stacktrace;
    
    @Getter @Setter
    private int    count;
    
    public Error() {}
    
    public Error(String message, String stacktrace) {
      this.message    = message;
      this.stacktrace = stacktrace;
    }
    
    public void incrCount() { count++; }
    
    static public String key(String stacktrace) {
      String md5 = MD5.digest(stacktrace).toString();
      return md5;
    }
  }
}