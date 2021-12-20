package com.devteam.core.module.http.session;

import com.devteam.core.module.common.ClientInfo;

import java.util.HashMap;
import java.util.Map;

public class ClientSession {
  private ClientInfo client;
  
  private Map<String, Object> beans = new HashMap<>(3);

  public ClientSession(ClientInfo client) {
    this.client = client;
  }
  
  public String getSessionId() { return client.getSessionId(); }
  
  public ClientInfo getClientInfo() { return this.client; }
  public void setClientInfo(ClientInfo client) { this.client = client; }
  
  public <T> T getBean(String name) { return (T) beans.get(name); }
  public  void setBean(String name, Object bean) { beans.put(name, bean); }
  
  public <T> T getBean(Class<T> type) { return (T) beans.get(type.getName()); }
  public  void setBean(Object bean) { 
    if(bean == null) return;
    setBean(bean.getClass().getName(), bean); 
  }
  public <T> void setBean(Class<T> type, Object bean) { 
    if(bean == null) return;
    setBean(type.getName(), bean); 
  }
}
