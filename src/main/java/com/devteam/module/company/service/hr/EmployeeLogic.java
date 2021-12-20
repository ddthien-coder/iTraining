package com.devteam.module.company.service.hr;

import java.util.ArrayList;
import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.DAOService;
import com.devteam.core.module.data.db.RecordGroupByMap;
import com.devteam.core.module.data.db.SqlMapRecord;
import com.devteam.core.module.data.db.entity.ChangeStorageStateRequest;
import com.devteam.core.module.data.db.entity.StorageState;
import com.devteam.core.module.data.db.query.*;
import com.devteam.core.util.ds.Arrays;
import com.devteam.core.util.ds.Objects;
import com.devteam.module.account.AccountLogic;
import com.devteam.module.account.AccountModel;
import com.devteam.module.account.entity.Account;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.core.security.CompanyAclModel;
import com.devteam.module.company.service.hr.entity.Employee;
import com.devteam.module.company.service.hr.entity.HRDepartment;
import com.devteam.module.company.service.hr.entity.HRDepartmentEmployeeRelation;
import com.devteam.module.company.service.hr.plugin.EmployeeServicePlugin;
import com.devteam.module.company.service.hr.plugin.HRServicePlugin;
import com.devteam.module.company.service.hr.repository.EmployeeRepository;
import com.devteam.module.company.service.hr.repository.HRDepartmentEmployeeRelationRepository;
import com.devteam.module.company.service.hr.repository.HRDepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EmployeeLogic extends DAOService {
  @Autowired
  private EmployeeRepository employeeRepo;

  @Autowired
  private HRDepartmentEmployeeRelationRepository deptEmplRelRepo;
  
  @Autowired
  private HRDepartmentRepository departmentRepo;

  @Autowired
  private AccountLogic accountLogic;
  
  @Autowired(required = false)
  private List<HRServicePlugin> plugins = new ArrayList<>();
  
  @Autowired(required = false)
  private List<EmployeeServicePlugin> employeePlugins = new ArrayList<>();

  public Employee createEmployee(ClientInfo clientInfo, Company company, Account account, Employee employee) {
    employee.setLoginId(account.getLoginId());
    
    //TODO: missing preSave
    Employee savedEmployee = employeeRepo.save(clientInfo, company, employee);
    
    //TODO: new Employee parameter is not correct, create is always new
    for(EmployeeServicePlugin employeePlugin : employeePlugins) {
      employeePlugin.onPostSave(clientInfo, company, savedEmployee, false);
    }
    return savedEmployee;
  }

  public Employee createEmployee(ClientInfo clientInfo, Company company, NewEmployeeModel model) {
    Account account = model.getAccount();
    if(account.isNew()) {
      accountLogic.createNewAccount(clientInfo, model);
    }
    Employee employee = new Employee(account.getLoginId());
    employee.setLabel(account.getFullName());

    //TODO: missing preSave, should reuse the above createEmployee method
    Employee savedEmployee = employeeRepo.save(clientInfo, company, employee);

    if(Objects.nonNull(model.getDepartmentIds())) {
      for(Long departmentId : model.getDepartmentIds()) {
        HRDepartment department = departmentRepo.getById(departmentId);
        HRDepartmentEmployeeRelation relation = new HRDepartmentEmployeeRelation(department, savedEmployee);
        deptEmplRelRepo.save(clientInfo, company, relation);
      }
    }
    for(EmployeeServicePlugin employeePlugin : employeePlugins) {
      employeePlugin.onPostSave(clientInfo, company, savedEmployee, false);
    }
    return savedEmployee;
  }

  public Employee getEmployee(ClientInfo clientInfo, Company company, String loginId) {
    return employeeRepo.getByLoginId(company.getId(), loginId);
  }
  
  public EmployeeModel loadEmployeeModel(ClientInfo clientInfo, Company company, EmployeeModelRequest req) {
    String loginId = req.getLoginId();
    
    Employee employee = employeeRepo.getByLoginId(company.getId(), loginId);
    EmployeeModel model = new EmployeeModel(employee);
    AccountModel accountModel = accountLogic.loadAccountModel(clientInfo, loginId);
    model.withAccountModel(accountModel);
    
    if (req.isLoadCompany()) {
      model.setCompany(company);
    }
    return model;
  }
  
  public List<Employee> findEmployees(Long departmentId){
    return employeeRepo.findByDepartmentId(departmentId);
  }
  
  public List<Employee> findEmployees(Company company){
    return employeeRepo.findByCompanyId(company.getId());
  }
  
  public SqlQuery createEmployeesQuery(Company company, SqlQueryParams params) {
    params.addParam("companyId", company.getId());
    SqlQuery query = 
        new SqlQuery()
        .ADD_TABLE(new EntityTable(Employee.class).selectAllFields())
        .FILTER(new ClauseFilter(Employee.class, "companyId", "=", ":companyId"))
        .FILTER(
             SearchFilter.isearch(Employee.class, new String[] {"loginId", "label", "description"}))
        .FILTER(
             OptionFilter.storageState(Employee.class),
             RangeFilter.modifiedTime(Employee.class))
        .ORDERBY(new String[] {"loginId", "modifiedTime"}, "loginId", "ASC");
    if(params.hasParam("departmentId")) {
      query
      .JOIN(new Join("JOIN", HRDepartmentEmployeeRelation.class).ON("employeeId", Employee.class, "id"))
      .JOIN(
          new Join("JOIN", HRDepartment.class)
          .ON("id", HRDepartmentEmployeeRelation.class, "departmentId")
          .AND("id", "=", ":departmentId"));
    }query.mergeValue(params);
    return query; 
  }
  
  public List<SqlMapRecord> searchEmployees(ClientInfo client, Company company, SqlQueryParams params) {
    SqlQuery query = createEmployeesQuery(company, params);
    List<SqlMapRecord> recordList = query(client, query).getSqlMapRecords();
    if(recordList.size() == 0) return recordList;
    
    List<Long> employeeIds = fieldValueOf(recordList, "id", Long.class);
    RecordGroupByMap<Long, SqlMapRecord> departmentMap = findDepartmentByEmployeeIds(client, company, employeeIds);
    
    for(SqlMapRecord record : recordList) {
      Long employeeId = (Long) record.get("id");
      record.put("departments", departmentMap.get(employeeId));
    }
    return recordList;
  }
  
  private RecordGroupByMap<Long, SqlMapRecord> findDepartmentByEmployeeIds(ClientInfo client, Company company, List<Long> employeeIds) {
    SqlQueryParams params =  new SqlQueryParams().addParam("EmployeeIdList", employeeIds);
    SqlQuery departmentQuery = new SqlQuery()
        .ADD_TABLE(new EntityTable(HRDepartment.class).selectAllFields())
        .JOIN(new Join("LEFT JOIN", HRDepartmentEmployeeRelation.class).addSelectField("employeeId", "employeeId").ON("departmentId", HRDepartment.class, "id"))
        .FILTER( new ClauseFilter(HRDepartmentEmployeeRelation.class, "employeeId", "IN","(:EmployeeIdList)"));
    
    departmentQuery.mergeValue(params);
    
    List<SqlMapRecord> departments = query(client, departmentQuery).getSqlMapRecords();
    RecordGroupByMap<Long, SqlMapRecord> departmentMap = 
        new RecordGroupByMap<>(departments, department -> (Long)department.get("employeeId"));
    return departmentMap;
  }
  
  //Need to review this function
  public boolean changeStorageState(ClientInfo client, Company company, ChangeStorageStateRequest req) {
    List<Employee> employees = employeeRepo.findByIds(req.getEntityIds());
    for(Employee employee : employees) {
      changeStorageState(client, employee, req.getNewStorageState());
    }
    return true;
  }
  
  //Need to review this function
  public boolean changeStorageState(ClientInfo client, Employee employee, StorageState state) {
    plugins.forEach(plugin -> {
      plugin.onPreStateChange(client, employee, state);
    });
    employeeRepo.setStorageState(Arrays.asList(employee.getId()), state);
    plugins.forEach(plugin -> {
      plugin.onPostStateChange(client, employee, state);
    });
    return true;
  }

  public List<CompanyAclModel> findCompanyAcls(ClientInfo client, String loginId) {
    SqlQuery query = new SqlQuery()
        .ADD_TABLE(
            new EntityTable(Employee.class)
            .addSelectField("loginId", "loginId")
            .addSelectField("priority", "priority"),
            new EntityTable(Company.class)
            .addSelectField("id", "companyId")
            .addSelectField("parentId", "companyParentId")
            .addSelectField("code", "companyCode")
                .addSelectField("label", "companyLabel"))
        .FILTER(new ClauseFilter(Employee.class, "companyId", "=", Company.class, "id"))
        .FILTER(new ClauseFilter(Employee.class, "loginId", "=", ":loginId"))
        .FILTER(new OptionFilter(Employee.class, "storageState", "=", StorageState.ALL).value(StorageState.ACTIVE))
        .ORDERBY(new String[] { "priority" }, "priority", "ASC");
    query.addParam("loginId", loginId);
    return query(client, query, CompanyAclModel.class);
  }
  
  public HRDepartmentEmployeeRelation createEmployeeDepartmentRelation(ClientInfo client, Company company, Employee empl, HRDepartment dept) {
    HRDepartmentEmployeeRelation relation = deptEmplRelRepo.save(new HRDepartmentEmployeeRelation(dept, empl));
    return relation;
  }
}