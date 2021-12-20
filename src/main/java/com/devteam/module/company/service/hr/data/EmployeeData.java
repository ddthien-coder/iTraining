package com.devteam.module.company.service.hr.data;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.SqlMapRecord;
import com.devteam.core.module.data.db.sample.EntityDB;
import com.devteam.core.util.ds.AssertTool;
import com.devteam.module.account.AccountService;
import com.devteam.module.account.data.UserData;
import com.devteam.module.account.entity.Account;
import com.devteam.module.account.entity.UserProfile;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.service.hr.entity.Employee;
import com.devteam.module.company.service.hr.entity.HRDepartment;
import org.springframework.beans.factory.annotation.Autowired;

public class EmployeeData extends DBModuleDataAssert {

  @Autowired
  private AccountService accountService;
  
  public Employee   ADMIN;
  public Employee   THIEN;
 
  
  public Employee[] ALL_EMPLOYEE;
  
  protected void initialize(ClientInfo client, Company company) {
    UserData       USER = EntityDB.getInstance().getData(UserData.class);
    DepartmentData DEPT = EntityDB.getInstance().getData(DepartmentData.class);
    
    ADMIN = new EmployeeBuilder(client, company, new UserProfile("admin")).get();

    
    THIEN =
        new EmployeeBuilder(client, company, USER.THIEN)
        .create()
        .joinDepartments(DEPT.IT)
        .get();
    
    ALL_EMPLOYEE = new Employee[] { THIEN};
  }

  public class EmployeeBuilder {
    private ClientInfo client;
    private Company company;
    private Employee employee;

    public EmployeeBuilder(ClientInfo client, Company company, UserProfile profile) {
      this.client = client;
      this.company = company;
      this.employee = new Employee(profile);
    }
    
    public Employee get() { return this.employee; }

    EmployeeBuilder create() {
      Account account = accountService.getAccount(client, employee.getLoginId());
      employee = hrService.createEmployee(client, company, account, employee);
      return this;
    }
    
    EmployeeBuilder joinDepartments(HRDepartment... departments) {
      for(HRDepartment dept : departments) {
        dept =  hrService.getHRDepartment(client, company, dept.getName());
        hrService.createEmployeeDepartmentRelation(client, company, employee, dept);
      }
      return this;
    }
  }
  
  public void assertCompanyEmployee() {
    DepartmentData DEPT = EntityDB.getInstance().getData(DepartmentData.class);
    new CompanyEmployeeAssert(client, company, THIEN , DEPT.IT.getName())
    .assertLoad((origin, entity) -> {
      AssertTool.assertNotNull(entity.getLoginId());
    })
    .assertEntitySearch((entity, list) -> {
    	SqlMapRecord rec = (SqlMapRecord) list.get(0);
      AssertTool.assertEquals(entity.getLoginId(), rec.get("loginId"));
    })
    .assertEntityArchive();
  }
}
