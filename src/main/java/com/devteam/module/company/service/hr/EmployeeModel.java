package com.devteam.module.company.service.hr;

import com.devteam.module.account.AccountModel;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.service.hr.entity.Employee;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class EmployeeModel {
  String       loginId;
  AccountModel accountModel;
  Employee employee;
  Company company;

  public EmployeeModel(Employee employee) {
    this.loginId = employee.getLoginId();
    this.employee = employee;
  }
  
  public EmployeeModel(AccountModel accountModel, Employee employee) {
    this.accountModel = accountModel;
    this.employee = employee;
  }

  public EmployeeModel withAccountModel(AccountModel accountModel) {
    this.accountModel = accountModel;
    return this;
  }

  public EmployeeModel withEmployee(Employee employee) {
    this.employee = employee;
    return this;
  }

  public EmployeeModel withCompany(Company company) {
    this.company = company;
    return this;
  }
}
