package com.devteam.module.company.service.hr.data;

import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.query.SqlQueryParams;
import com.devteam.core.module.http.upload.UploadService;
import com.devteam.module.account.AccountService;
import com.devteam.module.company.core.data.CompanyEntityAssert;
import com.devteam.module.company.core.data.CompanySampleData;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.service.hr.HRService;
import com.devteam.module.company.service.hr.entity.*;
import org.springframework.beans.factory.annotation.Autowired;

abstract public class DBModuleDataAssert extends CompanySampleData {

  @Autowired
  HRService hrService;

  @Autowired
  AccountService accountService;
  
  @Autowired
  private UploadService uploadService ;
  

  // Company HR Department
  public class CompanyHrDepartmentAssert extends CompanyEntityAssert<HRDepartment> {
    public CompanyHrDepartmentAssert(ClientInfo client, Company company, HRDepartment department) {
      super(client, company, department);
      this.methods = new EntityServiceMethods() {
        public HRDepartment load() {
          return hrService.getHRDepartment(client, company, department.getName());
        }

        public HRDepartment save(HRDepartment entity) {
          return hrService.saveHRDepartment(client, company, entity);
        }
      };
    }
  }

  //Company Employee
  public class CompanyEmployeeAssert extends CompanyEntityAssert<Employee> {
    public CompanyEmployeeAssert(ClientInfo client, Company company, Employee employee, String departmentName) {
      super(client, company, employee);
      this.methods = new EntityServiceMethods() {
        public Employee load() {
          return hrService.getEmployee(client, company, entity.getLoginId());
        }
        
        public List<?> search(SqlQueryParams params) {
            params.addParam("department", departmentName);
            return hrService.searchEmployees(client, company, params);
          }

        public boolean archive() {
          return hrService.changeEmployeesStorageState(client, company, createArchivedStorageRequest(entity));
        }
      };
    }
  }

}