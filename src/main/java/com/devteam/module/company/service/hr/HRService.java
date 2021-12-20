package com.devteam.module.company.service.hr;

import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.SqlMapRecord;
import com.devteam.core.module.data.db.activity.LogTransactionActivity;
import com.devteam.core.module.data.db.entity.ChangeStorageStateRequest;
import com.devteam.core.module.data.db.query.SqlQueryParams;
import com.devteam.module.account.entity.Account;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.core.security.CompanyAclModel;
import com.devteam.module.company.service.hr.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class HRService {
  @Autowired
  private DepartmentLogic departmentLogic;
  
  @Autowired
  private EmployeeLogic employeeLogic;

  //HR Department
  @Transactional(readOnly = true)
  public HRDepartment getHRDepartment(ClientInfo clientInfo, Company company, Long id) {
    return departmentLogic.getHRDepartment(clientInfo, company, id);
  }
  
  @Transactional(readOnly = true)
  public HRDepartment getHRDepartment(ClientInfo clientInfo, Company company, String name) {
    return departmentLogic.getHRDepartment(clientInfo, company, name);
  }

  @Transactional(readOnly = true)
  public List<HRDepartment> findHRDepartmentChildren(ClientInfo client, Company company, Long groupId) {
    return departmentLogic.findHRDepartmentChildren(client, company, groupId);
  }
  
  @Transactional
  public HRDepartment createHRDepartment(ClientInfo clientInfo, Company company, HRDepartment parentDept, HRDepartment dept) {
    return departmentLogic.createHRDepartment(clientInfo, company, parentDept, dept);
  }
  
  
  @Transactional
  public HRDepartment saveHRDepartment(ClientInfo clientInfo, Company company, HRDepartment hRDepartment) {
    return departmentLogic.saveHRDepartment(clientInfo, company, hRDepartment);
  }
  
  @Transactional(readOnly = true)
  public List<HRDepartment> searchHRDepartment(ClientInfo client, Company company, SqlQueryParams params) {
    return departmentLogic.searchHRDepartment(client, company, params);
  }
  
  @Transactional
  public Boolean deleteHRDepartment(ClientInfo clienInfo, Company company, Long id) {
    return departmentLogic.delete(clienInfo, company, id);
  }
  
  @Transactional
  public boolean createHRDepartmentRelations(ClientInfo clientInfo, Company company, Long departmentId, List<Long> employeeIds) {
    return departmentLogic.createHRDepartmentRelations(clientInfo, company, departmentId, employeeIds);
  }
  
  @Transactional
  public boolean deleteHRDepartmentRelations(ClientInfo clientInfo, Company company, Long departmentId, List<Long> employeeIds) {
    return departmentLogic.deleteHRDepartmentRelations(clientInfo, company, departmentId, employeeIds);
  }

  //Employee
  @Transactional
  public Employee createEmployee(ClientInfo clientInfo, Company company, Account account, Employee employee) {
    return employeeLogic.createEmployee(clientInfo, company, account, employee);
  }

  @Transactional
  public Employee createEmployee(ClientInfo client, Company company, NewEmployeeModel model) {
    return employeeLogic.createEmployee(client, company, model);
  }
  
  @Transactional(readOnly = true)
  public EmployeeModel loadEmployeeModel(ClientInfo clientInfo, Company company, EmployeeModelRequest request) {
    return employeeLogic.loadEmployeeModel(clientInfo, company, request);
  }
  
  @Transactional(readOnly = true)
  public Employee getEmployee(ClientInfo clientInfo, Company company, String loginId) {
    return employeeLogic.getEmployee(clientInfo, company, loginId);
  }
  
  @Transactional(readOnly = true)
  public List<SqlMapRecord> searchEmployees(ClientInfo client, Company company, SqlQueryParams params) {
    return employeeLogic.searchEmployees(client, company, params);
  }
  
  @Transactional(readOnly = true)
  public List<Employee> findEmployees(ClientInfo client, Company company) { 
    return employeeLogic.findEmployees(company);
  }
  
  @Transactional(readOnly = true)
  public List<CompanyAclModel> findCompanyAcls(ClientInfo client, String loginId) {
    return employeeLogic.findCompanyAcls(client, loginId);
  }

  @Transactional
  public HRDepartmentEmployeeRelation createEmployeeDepartmentRelation(ClientInfo client, Company company, Employee empl, HRDepartment dept) {
    return employeeLogic.createEmployeeDepartmentRelation(client, company, empl, dept);
  }
  
  @Transactional
  public boolean changeEmployeesStorageState(ClientInfo client, Company company, ChangeStorageStateRequest req) {
    return employeeLogic.changeStorageState(client, company, req);
  }
  
}