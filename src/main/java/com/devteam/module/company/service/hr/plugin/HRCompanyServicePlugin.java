package com.devteam.module.company.service.hr.plugin;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.module.account.AccountLogic;
import com.devteam.module.account.NewAccountModel;
import com.devteam.module.account.entity.Account;
import com.devteam.module.account.entity.AccountType;
import com.devteam.module.company.core.CompanyService;
import com.devteam.module.company.core.data.CompanyData;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.core.plugin.CompanyServicePlugin;
import com.devteam.module.company.service.hr.EmployeeLogic;
import com.devteam.module.company.service.hr.entity.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class HRCompanyServicePlugin extends CompanyServicePlugin {
  @Autowired
  private AccountLogic accountLogic;
  
  @Autowired
  private EmployeeLogic employeeLogic;
  
  public HRCompanyServicePlugin() {
    super("company", CompanyService.class.getSimpleName(), "hr");
  }

  @Override
  public void onPreSave(ClientInfo client, Company company, boolean isNew) {
  }

  @Override
  public void onPostSave(ClientInfo client, Company company, boolean isNew) {
    if(!isNew) return;
    createAdminEmployee(client, company, "admin");
    String companyAdminLoginId = company.getAdminAccountLoginId();
    if(companyAdminLoginId != null && !"admin".equals(companyAdminLoginId)) {
      createAdminEmployee(client, company, companyAdminLoginId);
    }
  }
  
  void createAdminEmployee(ClientInfo client, Company company, String loginId) {
    Account adminAccount = accountLogic.getAccount(client, loginId);
    if(adminAccount == null) {
      adminAccount = new Account(loginId, loginId, null, AccountType.ORGANIZATION);
      adminAccount.setFullName(company.getLabel());
      NewAccountModel model = new NewAccountModel().withAccount(adminAccount);
      accountLogic.createNewAccount(client, model);
    }
    Employee adminEmpl = new Employee(adminAccount.getLoginId());
    if(CompanyData.TEST_COMPANY_CODE.equals(company.getCode())) {
      adminEmpl.setPriority(1);
    }
    adminEmpl.setLabel(adminAccount.getFullName());
    employeeLogic.createEmployee(client, company, adminAccount, adminEmpl);
  }

}
