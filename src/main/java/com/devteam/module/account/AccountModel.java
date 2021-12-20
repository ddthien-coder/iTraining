package com.devteam.module.account;

import java.util.List;

import com.devteam.module.account.entity.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter @Setter
public class AccountModel {
  String           loginId;
  Account account;
  UserProfile userProfile;
  OrgProfile orgProfile;

  
  public AccountModel(String loginId) {
    this.loginId = loginId;
  }
  
  public AccountModel(Account account) {
    this.loginId = account.getLoginId();
    this.account = account;
  }
  
  public AccountModel withAccount(Account account) {
    this.account = account;
    return this;
  }

  
  public AccountModel withOrgProfile(OrgProfile profile) {
    this.orgProfile = profile;
    return this;
  }
  
  public AccountModel withUserProfile(UserProfile profile) {
    this.userProfile = profile;
    return this;
  }

  
}
