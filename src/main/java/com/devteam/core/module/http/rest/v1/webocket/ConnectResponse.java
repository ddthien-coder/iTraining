package com.devteam.core.module.http.rest.v1.webocket;

import lombok.Getter;
import lombok.Setter;

public class ConnectResponse {
  @Getter @Setter
  private String content;
  
  @Getter @Setter
  private boolean authenticated = false;

  public ConnectResponse() {
  }

  public ConnectResponse(String content) {
    this.content = content;
    authenticated = true;
  }
}