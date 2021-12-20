package com.devteam.module.account;

import java.util.List;

import com.devteam.module.account.entity.Account;
import com.devteam.module.account.entity.AccountType;
import com.devteam.module.account.entity.OrgProfile;
import com.devteam.module.account.entity.UserProfile;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter @Setter
public class NewAccountModel {
  private Account account;
  private UserProfile userProfile;
  private OrgProfile orgProfile;

  private List<Long> accountGroupIds;
  
  public NewAccountModel withAccount(Account account) {
    this.account = account;
    return this;
  }
  
  public NewAccountModel withUserProfile(UserProfile profile) {
    this.userProfile = profile;
    return this;
  }
  
  public NewAccountModel withUserProfile(UserProfile profile, String password) {
    withUserProfile(profile);
    account = 
        new Account(profile.getLoginId(), password, profile.getEmail(), 
            profile.getMobile(), profile.getFullName(), AccountType.USER)
        .withFullName(profile.getFullName());
    return this;
  }
  
  public NewAccountModel withOrgProfile(OrgProfile profile) {
    this.orgProfile = profile;
    return this;
  }
  
  public NewAccountModel withOrgProfile(OrgProfile profile, String password) {
    this.orgProfile = profile;
    account = 
        new Account(profile.getLoginId(), password, profile.getEmail(), 
            profile.getMobile(), profile.getFullName(), AccountType.ORGANIZATION)
        .withFullName(profile.getFullName());
    return this;
  }
}
