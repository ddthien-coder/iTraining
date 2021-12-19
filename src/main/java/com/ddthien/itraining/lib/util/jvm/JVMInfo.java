package com.ddthien.itraining.lib.util.jvm;

import com.ddthien.itraining.lib.util.DateUtil;

import java.lang.management.GarbageCollectorMXBean;
import java.lang.management.ManagementFactory;
import java.util.ArrayList;
import java.util.List;


public class JVMInfo {

    private String                          startTime;
    private String                          upTime;

    private MemoryInfo                      memoryInfo;
    private ArrayList<GarbageCollectorInfo> garbageCollectorInfo;
    private JVMThreads                      threads;

    public JVMInfo() { }

    public JVMInfo init() {
        startTime = DateUtil.asCompactDateTime(ManagementFactory.getRuntimeMXBean().getStartTime()) ;
        upTime = DateUtil.asHumanReadable(ManagementFactory.getRuntimeMXBean().getUptime()) ;
        memoryInfo = new MemoryInfo().init();

        List<GarbageCollectorMXBean> gcbeans = ManagementFactory.getGarbageCollectorMXBeans() ;
        garbageCollectorInfo = new ArrayList<GarbageCollectorInfo>();
        for(int i = 0; i < gcbeans.size(); i++) {
            GarbageCollectorMXBean gcbean = gcbeans.get(i) ;
            garbageCollectorInfo.add(new GarbageCollectorInfo(gcbean));
        }
        threads = new JVMThreads();
        return this;
    }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getUpTime() { return upTime; }
    public void setUpTime(String upTime) { this.upTime = upTime; }

    public MemoryInfo getMemoryInfo() { return memoryInfo; }
    public void setMemoryInfo(MemoryInfo memoryInfo) { this.memoryInfo = memoryInfo; }

    public ArrayList<GarbageCollectorInfo> getGarbageCollectorInfo() { return garbageCollectorInfo; }
    public void setGarbageCollectorInfo(ArrayList<GarbageCollectorInfo> garbageCollectorInfo) {
        this.garbageCollectorInfo = garbageCollectorInfo;
    }

    public JVMThreads getThreads() { return threads; }
    public void setThreads(JVMThreads threads) { this.threads = threads; }
}
