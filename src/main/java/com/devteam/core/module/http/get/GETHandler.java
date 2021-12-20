package com.devteam.core.module.http.get;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.ICompany;
import lombok.Getter;

abstract public class GETHandler {
  @Getter
  private String name;
  
  protected GETHandler(String name) {
    this.name = name;
  }
  
  abstract public GETContent get(ClientInfo client, ICompany company, String path) ;

  public GETContent get(String path) {
    throw new RuntimeException("Need to implement this method");
    
  }
}
