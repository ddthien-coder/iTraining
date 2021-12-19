package com.ddthien.itraining.core.http.rest.monitor;

import com.ddthien.itraining.core.http.RestResponseError;
import org.springframework.stereotype.Service;


@Service
public class RestCallMonitorService implements Monitorable<RestMonitor> {
    private RestMonitor monitor = new RestMonitor() ;

    public String getMonitorName() { return "RestMonitor"; }

    public void log(String module, String service, String endpoint, long receivedAt, long finishedAt, RestResponseError err) {
        monitor.onRequest(module, service, endpoint, receivedAt, finishedAt, err);
    }

    public JVMSummary getMonitorSummary() {
        JVMSummary summary = new JVMSummary() ;
        summary.setName(getMonitorName()) ;
        summary.setDescription("Monitor the rest api calls") ;
        summary.addProperty("Calls", monitor.getTotalCall()) ;
        summary.addProperty("Errors", monitor.getTotalError()) ;
        summary.addProperty("Agv Exec Time", monitor.getAvgExecTime()) ;
        summary.addProperty("Max Exec Time", monitor.getMaxExecTime()) ;
        return summary ;
    }
    public RestMonitor getMonitor() { return monitor ; }
}
