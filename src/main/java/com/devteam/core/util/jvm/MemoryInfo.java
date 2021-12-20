package com.devteam.core.util.jvm;

import com.devteam.core.util.text.TextUtil;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;


public class MemoryInfo {
  
  private String init ;
  private String use ;
  private String committed ;
  private String max ;
  
  public MemoryInfo() { } 
  
  public MemoryInfo init() {
    MemoryMXBean mbean = ManagementFactory.getMemoryMXBean();
    MemoryUsage memory = mbean.getHeapMemoryUsage() ;
    
    init = TextUtil.asHummanReadableBytes(memory.getInit()) ;
    max = TextUtil.asHummanReadableBytes(memory.getMax()) ;
    use = TextUtil.asHummanReadableBytes(memory.getUsed()) ;
    committed = TextUtil.asHummanReadableBytes(memory.getCommitted()) ;
    return this;
  }
  
  public String getInit() { return init; }
  public void setInit(String init) { this.init = init; }

  public String getUse() { return use ; }
  public void setUse(String use) { this.use = use; }

  public String getCommitted() { return committed ;}
  public void setCommitted(String committed) { this.committed = committed; }

  public String getMax() { return max; }
  public void setMax(String max) { this.max = max; }
  
  public String toString() {
    StringBuilder b = new StringBuilder() ;
    b.append("Init: ").append(init).append("\n") ;
    b.append("Max: ").append(max).append("\n") ;
    b.append("Use: ").append(use).append("\n") ;
    b.append("Committed: ").append(committed) ;
    return b.toString() ;
  }
}
