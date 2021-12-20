package com.devteam.core.util.ds;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Pattern;

import com.devteam.core.util.cipher.MD5;
import com.devteam.core.util.text.StringUtil;
import com.fasterxml.jackson.annotation.JsonIgnore;


public class URLInfo {
  private Pattern PARAM_SEPARATOR = Pattern.compile("&amp;|&") ;

  private String url ;
  private String protocol ;
  private String host ;
  private String port = "80";
  private String path ;
  private String directory;
  private String name;
  private String ref;
  private String ext ;
  private TreeMap<String, String[]> params ;
  
  public URLInfo(String url) {
    this.url = url ;
    String remainString = url.trim() ;

    int idx = remainString.indexOf("://") ;
    if(idx > 0) {
      this.protocol = remainString.substring(0, idx + 3);
      remainString = remainString.substring(idx + 3, remainString.length());
    }

    idx = endHostName(remainString) ;
    if(idx > 0) {
      parseHostPort(remainString.substring(0, idx)) ;
      remainString = remainString.substring(idx, remainString.length()) ;
    } else {
      int questionMark = remainString.indexOf('?') ;
      if(questionMark > 0) {
        parseHostPort(remainString.substring(0, questionMark)) ;
        remainString = remainString.substring(questionMark + 1, remainString.length()) ;
      } else {
        parseHostPort(remainString) ;
        remainString = null ;
      }
    }
    if(remainString == null) return  ;
    int refIndex = remainString.indexOf('#') ;
    if(refIndex > 0) {
      this.ref = remainString.substring(refIndex + 1) ;
      remainString = remainString.substring(0, refIndex) ;
    }

    int questionMark = remainString.indexOf('?') ;
    if(questionMark > 0) {
      this.path = remainString.substring(0, questionMark) ;
      remainString = remainString.substring(questionMark + 1, remainString.length()) ;
    } else {
      this.path = remainString ;
      remainString = null ;
    }
    
    if(path != null && path.length() > 1) {
      int lastSlashIdx = path.lastIndexOf('/') ;
      if(lastSlashIdx > 0) {
        directory = path.substring(0, lastSlashIdx);
        name = path.substring(lastSlashIdx + 1, path.length()) ;
      }
      
    }
    
    if(remainString == null) return  ;
    parseParams(remainString) ;
  }

  public String getUrl() { return this.url ; }
  public String getProtocol() { return protocol ; }
  public String getHost() { return host ; }
  public String getPort() { return port ; }
  
  public String getPath() { 
    if(path == null || path.isEmpty()) return "/" ;
    return this.path ; 
  }
  
  public String getDirectory() { 
    if(directory == null || directory.isEmpty()) return "/" ;
    return this.directory ; 
  }
  
  public String getName() { return this.name ; }
  
  public String getRef() { return ref; }

  public String getPathExtension() {
    if(this.ext == null) {
      if(path != null) {
        int idx = path.lastIndexOf('.') ;
        if(idx > 0) ext = path.substring(idx + 1) ;
        else ext = "" ;
      } else {
        ext = "" ;
      }
    }
    return ext;
  }
  
  public int getParamCount() { return params == null ? 0 : params.size() ; }
  
  public TreeMap<String, String[]> getParams() { return this.params ; }
  
  public String getNormalizeHostName() {
    if(host.startsWith("www.")) return host.substring("www.".length()) ; 
    return host ;
  }

  @JsonIgnore
  public String getSiteURL() {
    StringBuilder b = new StringBuilder() ;
    b.append(this.protocol).append(this.host) ;

    if(this.port != null && !"80".equals(this.port)) {
      b.append(':').append(this.port) ;
    }
    return b.toString() ;
  }
  
  @JsonIgnore
  public String getPathURL() {
    StringBuilder b = new StringBuilder() ;
    b.append(this.protocol).append(this.host) ;

    if(this.port != null && !"80".equals(this.port)) {
      b.append(':').append(this.port) ;
    }
    if(path != null) b.append(path);
    return b.toString() ;
  }

  @JsonIgnore
  public String getBaseURL() {
    StringBuilder b = new StringBuilder() ;
    b.append(this.protocol).append(this.host) ;

    if(this.port != null && !"80".equals(this.port)) {
      b.append(':').append(this.port) ;
    }
    if(directory != null) b.append(directory);
    return b.toString() ;
  }

  public String getPathWithParams() {
    StringBuilder b = new StringBuilder() ;
    if(path == null || path.isEmpty()) b.append("/") ;
    else b.append(path) ;
    if(params != null) {
      b.append('?') ;
      Iterator<Map.Entry<String, String[]>> i = params.entrySet().iterator() ;
      boolean firstParam = true ;
      while(i.hasNext()) {
        Map.Entry<String, String[]> entry = i.next() ;
        for(String value : entry.getValue()) {
          if(!firstParam) b.append("&") ;
          b.append(entry.getKey()).append('=').append(value) ;
          firstParam = false; 
        }
      }
    }
    //if(ref != null) b.append("#").append(ref) ;
    return b.toString() ;
  }

  @JsonIgnore
  public String getNormalizeURL() {
    StringBuilder b = new StringBuilder() ;
    b.append(getPathURL()) ;
    if(params != null) {
      b.append('?') ;
      Iterator<Map.Entry<String, String[]>> i = params.entrySet().iterator() ;
      boolean firstParam = true ;
      while(i.hasNext()) {
        Map.Entry<String, String[]> entry = i.next() ;
        if(entry.getValue() != null) {
          for(String value : entry.getValue()) {
            if(!firstParam) b.append("&") ;
            b.append(entry.getKey()).append('=').append(value) ;
            firstParam = false; 
          }
        } else {
          b.append(entry.getKey()) ;
        }
      }
    }
    return b.toString() ;
  }

  @JsonIgnore
  public String getNormalizeURLAll() {
    if(ref != null) {
      StringBuilder b = new StringBuilder() ;
      b.append(getNormalizeURL()) ;
      b.append("#").append(ref) ;
      return b.toString() ;
    } else {
      return getNormalizeURL() ;
    }
  }

  @JsonIgnore
  final public String[] getSources() { return getDomains(host) ; }

  @JsonIgnore
  public String[] getParamKeys() {
    if(params == null) return StringUtil.EMPTY_ARRAY ;
    return params.keySet().toArray(new String[params.size()]) ;
  }

  @JsonIgnore
  public String getHostMD5Id() {
    String host = getNormalizeHostName() ;
    StringBuilder b = new StringBuilder() ;
    b.append(this.protocol).append(host) ;

    if(this.port != null && !"80".equals(this.port)) {
      b.append(':').append(this.port) ;
    }
    if(path != null) b.append(path);
    if(params != null) {
      b.append('?') ;
      Iterator<Map.Entry<String, String[]>> i = params.entrySet().iterator() ;
      boolean firstParam = true ;
      while(i.hasNext()) {
        Map.Entry<String, String[]> entry = i.next() ;
        for(String value : entry.getValue()) {
          if(!firstParam) b.append("&") ;
          b.append(entry.getKey()).append('=').append(value) ;
          firstParam = false; 
        }
      }
    }
    MD5 md5 = MD5.digest(b.toString().toLowerCase()) ;
    return host + ":" + md5.toString();
  }

  public List<String> getPathSegments() {
    return StringUtil.split(getPath(), '/') ;
  }

  public void process(URLNormalizerProcessor[] processor) {
    for(URLNormalizerProcessor sel : processor) sel.process(this) ;
  }

  private void parseHostPort(String string) {
    string = string.toLowerCase() ;
    int idx = string.indexOf(':') ;
    if(idx > 0) {
      this.port = string.substring(idx + 1, string.length()) ;
      string = string.substring(0, idx) ;
    }
    if(string.startsWith("www")) {
      if(string.length() > 3 && string.charAt(3) != '.') {
        idx = string.indexOf('.') ;
        string = "www." + string.substring(idx + 1, string.length()) ;
      }
    }
    this.host = string ;
  }

  private void parseParams(String string) {
    String[] nameValue = PARAM_SEPARATOR.split(string) ;
    for(int i = 0; i < nameValue.length; i++) {
      int idx = nameValue[i].indexOf('=') ;
      if(idx < 0) {
        addParam(nameValue[i], null) ;
      } else {
        String name = nameValue[i].substring(0, idx).trim() ;
        String value = nameValue[i].substring(idx + 1, nameValue[i].length()).trim() ;
        addParam(name, value) ;
      }
    }
  }

  private void addParam(String name, String value) {
    if(params == null) params = new TreeMap<String, String[]>() ;
    String[] pvalue = params.get(name) ;
    if(pvalue == null) {
      params.put(name, new String[] { value }) ;
    } else {
      String[] newArray = new String[pvalue.length + 1] ;
      for(int i = 0; i < pvalue.length; i++) {
        newArray[i] = pvalue[i] ;
      }
      newArray[pvalue.length] = value ;
      params.put(name, newArray) ;
    }
  }

  private int endHostName(String string) {
    for(int i = 0; i < string.length(); i++) {
      char c = string.charAt(i) ;
      if(c == '/' || c == '?') return i ;
    }
    return string.length() ;
  }
  
  public String toString() {
    StringBuilder b = new StringBuilder();
    b.append(getNormalizeURLAll());
    return b.toString();
  }
  
  
  final static public String[] getDomains(String host) {
    List<String> holder = new ArrayList<String>() ;
    String source = host ;
    holder.add(source) ;
    int idx = source.indexOf('.') ;
    while(idx >= 0) {
      source = source.substring(idx + 1) ;
      if(source.indexOf('.') < 0) break ;
      holder.add(source) ;
      idx = source.indexOf('.') ;
    }
    holder.add(source) ;
    return holder.toArray(new String[holder.size()]);
  }
}