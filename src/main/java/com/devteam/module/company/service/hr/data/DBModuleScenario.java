package com.devteam.module.company.service.hr.data;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.AbstractDBModuleScenario;
import com.devteam.core.module.data.db.DBScenario;
import com.devteam.core.module.data.db.sample.EntityDB;
import com.devteam.module.company.core.data.CompanyData;
import com.devteam.module.company.core.entity.Company;
import lombok.NoArgsConstructor;


@NoArgsConstructor
public class DBModuleScenario extends AbstractDBModuleScenario {

  @Override
  public void initialize(ClientInfo client, DBScenario scenario) throws Exception {
    Company company = EntityDB.getInstance().getData(CompanyData.class).TEST_COMPANY;
    EntityDB.getInstance().getData(DepartmentData.class).init(client, company);
    EntityDB.getInstance().getData(EmployeeData.class).init(client, company);
  }
}