package com.devteam.core.module.http.rest.v1.webocket;

import lombok.Getter;
import lombok.Setter;

public class ConnectRequest {

  @Getter @Setter
  private String tenantId;
  
  @Getter @Setter
  private String loginId;
  
  @Getter @Setter
  private String password;

  public ConnectRequest() {
  }

  public ConnectRequest(String tenantId, String loginId, String password) {
    this.tenantId = tenantId;
    this.loginId  = loginId;
    this.password = password;
  }
}
