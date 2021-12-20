package com.devteam.core.module.http.rest.monitor;

public interface Monitorable<T> {
  public String getMonitorName() ;
  public JVMSummary getMonitorSummary() ;
  public T getMonitor() ;
}