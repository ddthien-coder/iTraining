package com.devteam.module.account.data;


import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.util.text.DateUtil;
import com.devteam.module.account.AccountService;
import com.devteam.module.account.NewAccountModel;
import com.devteam.module.account.entity.*;
import org.springframework.beans.factory.annotation.Autowired;


public class ThienData extends AccountData {
  static DateUtil.DateRandomizer DATE_RANDOMIZER = new DateUtil.DateRandomizer("1/1/2017@00:00:00", null);
  static AccountType USER         = AccountType.USER;
  
  @Autowired
  private AccountService service;

  public UserProfile PROFILE;

  public void initialize(ClientInfo client) {
    PROFILE = new UserProfile("ddthien", "Dinh duc thien",  "thien@devteam.com");
    NewAccountModel model = new NewAccountModel().withUserProfile(PROFILE, "ddthien");
    PROFILE = service.createNewAccount(client, model).getUserProfile();
    jpaService.getEntityManager().flush();
  }

}
