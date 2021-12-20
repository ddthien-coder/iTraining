package com.devteam.module.account.data;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.JPAService;
import com.devteam.core.module.data.db.sample.SampleData;
import com.devteam.module.account.AccountService;
import com.devteam.module.account.entity.AccountGroup;
import org.springframework.beans.factory.annotation.Autowired;

public class GroupData extends SampleData {
  @Autowired
  private AccountService service;

  @Autowired
  private JPAService jpaService;
  
  public AccountGroup COMPANY;

  public AccountGroup EMPLOYEES;
  public AccountGroup EMPLOYEES_SALE;
  public AccountGroup EMPLOYEES_HR;
  public AccountGroup EMPLOYEES_HR_ADMIN;

  public AccountGroup PARTNERS;

  public void initialize(ClientInfo client)  {
    COMPANY       = 
        new AccountGroup("company", "IT", "ITCompany");
    COMPANY = service.createAccountGroup(client, null, COMPANY);

    EMPLOYEES = new AccountGroup("employees", "Nhân viên", "IT employee group");
    service.createAccountGroup(client, COMPANY, EMPLOYEES);

    PARTNERS = new AccountGroup("partners", "Partners", "IT partners");
    service.createAccountGroup(client, COMPANY, PARTNERS);

    EMPLOYEES_HR = 
        new AccountGroup("hr", "Nhan vien hanh chinh", "hr is a subGroup org/employees/");
    service.createAccountGroup(client, EMPLOYEES, EMPLOYEES_HR);
    
    EMPLOYEES_HR_ADMIN = new AccountGroup("admin", "Admin Hành Chính", "Admin HR");
    service.createAccountGroup(client, EMPLOYEES_HR, EMPLOYEES_HR_ADMIN);
    
    jpaService.getEntityManager().flush();
  }

}
