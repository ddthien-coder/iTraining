
package com.devteam.module.company.core.data;


import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.AbstractDBModuleScenario;
import com.devteam.core.module.data.db.DBScenario;
import com.devteam.core.module.data.db.sample.EntityDB;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class CompanyDBModuleScenario extends AbstractDBModuleScenario {
  
  @Override
  public void initialize(ClientInfo client, DBScenario scenario) throws Exception {
    CompanyData _COMPANY = EntityDB.getInstance().getData(CompanyData.class);
    _COMPANY.init(client);
  }
}