package com.ddthien.itraining.core.http.rest.monitor;

import java.lang.management.ManagementFactory;

import com.ddthien.itraining.lib.util.DateUtil;
import com.ddthien.itraining.lib.util.jvm.JVMInfo;
import com.ddthien.itraining.lib.util.jvm.MemoryInfo;
import org.springframework.stereotype.Service;


@Service("JVMService")
public class JVMService implements Monitorable<JVMInfo> {

    public String getMonitorName() { return "JVMMonitor"; }

    public JVMSummary getMonitorSummary() {
        JVMSummary summary = new JVMSummary() ;
        summary.setName(getMonitorName()) ;
        summary.setDescription("Monitor the jvm") ;
        String startTime = DateUtil.asCompactDateTime(ManagementFactory.getRuntimeMXBean().getStartTime()) ;
        String upTime = DateUtil.asHumanReadable(ManagementFactory.getRuntimeMXBean().getUptime()) ;
        MemoryInfo mInfo = new MemoryInfo().init();
        summary.addProperty("Start Time",    startTime) ;
        summary.addProperty("Up Time",       upTime) ;
        summary.addProperty("Mem Init",      mInfo.getInit()) ;
        summary.addProperty("Mem Max",       mInfo.getMax()) ;
        summary.addProperty("Mem Use",       mInfo.getUse()) ;
        summary.addProperty("Mem Commited",  mInfo.getCommitted()) ;
        return summary ;
    }

    public JVMInfo getMonitor() { return new JVMInfo().init() ; }
}
