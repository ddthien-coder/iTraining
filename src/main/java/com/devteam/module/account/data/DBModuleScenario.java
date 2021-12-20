package com.devteam.module.account.data;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.AbstractDBModuleScenario;

import com.devteam.core.module.data.db.DBScenario;
import com.devteam.core.module.data.db.sample.EntityDB;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class DBModuleScenario extends AbstractDBModuleScenario {
  public void initialize(ClientInfo client, DBScenario scenario) throws Exception {
    EntityDB.getInstance().getData(GroupData.class).initialize(client);
    EntityDB.getInstance().getData(UserData.class).initialize(client);
    EntityDB.getInstance().getData(OrgData.class).initialize(client);
    EntityDB.getInstance().getData(ThienData.class).initialize(client);
  }
}