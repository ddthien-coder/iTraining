package com.devteam.module.account.plugin;


import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.StorageState;
import com.devteam.core.module.data.db.plugin.ServicePlugin;
import com.devteam.module.account.entity.Account;

abstract public class AccountServicePlugin extends ServicePlugin {
  
  protected AccountServicePlugin(String type) {
    super("account", "AccountService", type);
  }

  public void onPreSave(ClientInfo client, Account account, boolean isNew) {
  }

  public void onPostSave(ClientInfo client, Account account, boolean isNew) {
  }

  public void onPreStateChange(ClientInfo client, Account account, StorageState newState) {
  }

  public void onPostStateChange(ClientInfo client, Account account, StorageState newState) {
  }
}
