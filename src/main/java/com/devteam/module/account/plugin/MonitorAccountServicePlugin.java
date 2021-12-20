package com.devteam.module.account.plugin;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.module.account.entity.Account;
import org.springframework.stereotype.Component;

@Component
public class MonitorAccountServicePlugin extends AccountServicePlugin {
  
  public MonitorAccountServicePlugin() {
    super("monitor");
  }

  @Override
  public void onPreSave(ClientInfo client, Account account, boolean isNew) {
  }

  @Override
  public void onPostSave(ClientInfo client, Account account, boolean isNew) {
  }

}
