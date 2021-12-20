package com.devteam.core.util.dataformat;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.GZIPInputStream;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.MappingJsonFactory;

public class JsonDataReader {
  private InputStream is ;
  private JsonParser parser ;

  public JsonDataReader(String file) throws Exception {
    this(file, file.endsWith(".gzip") || file.endsWith(".gz")) ;
  }

  public JsonDataReader(String file, boolean compress) throws Exception {
    if(compress) init(new GZIPInputStream(new FileInputStream(file))) ;
    else         init(new FileInputStream(file)) ;
  }

  public JsonDataReader(InputStream is) throws Exception {
    init(is) ;
  } 
  
  public JsonDataReader(InputStream is, boolean compress) throws Exception {
    if(compress)  init(new GZIPInputStream(is)) ;
    else          init(is) ;
  }


  private void init(InputStream is) throws Exception {
    this.is  = is ;
    MappingJsonFactory factory = new MappingJsonFactory();
    DataSerializer.configure(factory.getCodec());
    factory.configure(JsonParser.Feature.AUTO_CLOSE_SOURCE, false);
    parser = factory.createParser(new BufferedReader(new InputStreamReader(is, "UTF-8")));
  }

  public <T> T read(Class<T> type) throws Exception {
    if(parser.nextToken() == null) return null;
    try {
      T object = parser.readValueAs(type) ;
      return object ;
    } catch(Throwable ex) {
      ex.printStackTrace() ;
      return null ;
    }
  }
  
  public JsonNode readAsJsonNode() throws Exception {
    if(parser.nextToken() == null) return null;
    try {
      JsonNode jsonNode = parser.readValueAsTree();
      return jsonNode ;
    } catch(Throwable ex) {
      ex.printStackTrace() ;
      return null ;
    }
  }

  public <T> List<T> readAll(Class<T> type) throws Exception {
    List<T> holder = new ArrayList<T>() ;
    T object = null ;
    while((object = read(type)) != null) holder.add(object) ;
    return holder ;
  }

  public void close() throws Exception {
    parser.close() ;
    is.close() ;
  }
}