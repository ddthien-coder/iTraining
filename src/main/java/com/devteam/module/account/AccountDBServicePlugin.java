package com.devteam.module.account;

import javax.transaction.Transactional;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.DBScenario;
import com.devteam.core.module.data.db.DBServicePlugin;
import com.devteam.module.account.data.DBModuleScenario;
import com.devteam.module.account.entity.Account;
import com.devteam.module.account.entity.AccountType;
import com.devteam.module.account.plugin.MonitorAccountServicePlugin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(value = DBServicePlugin.ACCOUNT)
public class AccountDBServicePlugin extends DBServicePlugin {
  @Autowired
  AccountLogic accountLogic;
  
  @Autowired
  MonitorAccountServicePlugin monitorPlugin ;

  @Transactional
  @Override
  public void initDb(ClientInfo client, ApplicationContext context) throws Exception {
    monitorPlugin.createPluginInfo(client);

    Account adminAccount = new Account("admin", "admin", "admin@devteam.com", AccountType.USER);
    adminAccount.setFullName("Admin");
    NewAccountModel model = new NewAccountModel().withAccount(adminAccount);
    accountLogic.createNewAccount(client, model);
  }

  @Override
  public void createSammpleData(ClientInfo client,  ApplicationContext context) throws Exception {
    new DBScenario(context).add(DBModuleScenario.class).initialize(client);
  }
}
