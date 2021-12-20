package com.devteam.core.util.dataformat;

import com.devteam.core.util.io.FileUtil;

import javax.annotation.PostConstruct;


public class DataMultiFileReader {
  private String     location;
  private String[]   file;
  private int        currentFile = 0;
  private DataReader currentReader;

  public DataMultiFileReader() { }

  public DataMultiFileReader(String location) throws Exception {
    this.location = location ;
    onInit() ;
  }

  public String getLocation()           { return this.location ; }
  public void   setLocation(String loc) { this.location = loc ; }

  @PostConstruct
  public void onInit() throws Exception {
    this.file = FileUtil.findFiles(location, ".*\\.json.*") ;
  }

  public <T> T next(Class<T> type) throws Exception {
    if(currentReader == null && currentFile < file.length) {
      String cfile = file[currentFile++] ;
      currentReader = new DataReader(cfile) ;
    }

    if(currentReader == null) return null ;
    T doc = currentReader.read(type) ;
    if(doc == null) {
      currentReader.close() ;
      currentReader = null ;
      return next(type) ;
    }
    return doc ;
  }

  public void close() throws Exception {
    if(currentReader != null) currentReader.close() ;
  }
}