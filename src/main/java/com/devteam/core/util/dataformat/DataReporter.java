package com.devteam.core.util.dataformat;

import com.devteam.core.util.stat.Statistics;

import java.io.PrintStream;



public class DataReporter<T> {
  private String file ;
  private Class<T> type ;
  private Statistics map ;

  public DataReporter(String file, Class<T> type) {
    this.file = file ;
    this.type = type ;
    this.map = new Statistics() ;
  }

  public void process() throws Exception {
    map.clear() ;
    DataReader reader = new DataReader(file) ;
    T object  = null ;
    while((object = reader.read(type)) != null) {
      log(object) ;
    }
    reader.close() ;
  }

  protected void log(T object) {
    map.incr("Statistic", "all", 1) ;
  }

  public void report(PrintStream out) {
    map.report(out);
  }
}
