package com.devteam.core.module.http.rest.v1;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.http.session.ClientSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


public class AuthenticatedClient {
  private String tenantId;
  private String loginId;
  private String clientId;
  
  private Map<String, ClientInfo> authenticatedClientInfos = new ConcurrentHashMap<>(3);
  
  public AuthenticatedClient(ClientInfo client) {
    this.tenantId = client.getTenantId();
    this.loginId = client.getRemoteUser();
    this.clientId = client.getClientId();
  }

  public String getTenantId() { return tenantId; }
  public void setTenantId(String tenantId) { this.tenantId = tenantId; }

  public String getLoginId() { return loginId; }
  public void setLoginId(String loginId) { this.loginId = loginId; }

  public String getClientId() { return clientId; }
  public void setClientId(String clientId) { this.clientId = clientId; }

  public void addSession(ClientSession session) {
    authenticatedClientInfos.put(session.getSessionId(), session.getClientInfo());
  }
  
  public void removeSession(ClientSession session) {
    authenticatedClientInfos.remove(session.getSessionId());
  }
  
  public boolean isEmpty() { return authenticatedClientInfos.isEmpty(); }
}
