package com.devteam.module.account;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter @Setter
public class AccountModelRequest {
  String  loginId;
  boolean loadAccount = true;
  boolean loadProfile;
  
  public AccountModelRequest(String loginId) {
    this.loginId = loginId;
  }
  
  public AccountModelRequest loadAccount() {
    this.loadAccount = true;
    return this;
  }
  
  public AccountModelRequest loadProfile() {
    this.loadProfile = true;
    return this;
  }
}
