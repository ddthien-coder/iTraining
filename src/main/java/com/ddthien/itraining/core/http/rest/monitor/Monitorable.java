package com.ddthien.itraining.core.http.rest.monitor;

public interface Monitorable<T> {
    public String getMonitorName() ;
    public JVMSummary getMonitorSummary() ;
    public T getMonitor() ;
}
