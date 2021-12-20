package com.devteam.module.company.service.hr.http;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;

import javax.servlet.http.HttpSession;

import com.devteam.core.module.data.db.SqlMapRecord;
import com.devteam.core.module.data.db.entity.ChangeStorageStateRequest;
import com.devteam.core.module.data.db.query.SqlQueryParams;
import com.devteam.core.module.http.rest.RestResponse;
import com.devteam.core.module.http.rest.v1.AuthenticationService;
import com.devteam.module.account.AccountService;
import com.devteam.module.account.entity.Account;
import com.devteam.module.company.service.hr.HRService;
import com.devteam.module.company.service.hr.NewEmployeeModel;
import com.devteam.module.company.service.hr.entity.Employee;
import com.devteam.module.company.service.hr.entity.HRDepartment;
import com.devteam.module.company.service.http.BaseCompanyController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;



@ConditionalOnBean(AuthenticationService.class)
@Api(value="devteam", tags= {"company/hr"})
@RestController
@RequestMapping("/rest/v1.0.0/company/hr")
public class HRController extends BaseCompanyController {
  @Autowired
  private HRService hrService ;

  @Autowired
  private AccountService accountService ;
  
  protected HRController() {
    super("company", "/company/hr");
  }

  @ApiOperation(value = "Retrieve the hr department", response = HRDepartment.class)
  @GetMapping("department/{id}")
  public @ResponseBody RestResponse getHRDepartment(HttpSession session, @PathVariable("id") Long id) {
    Callable<HRDepartment> executor = () -> {
      ClientContext ctx = getClientContext(session);
      return hrService.getHRDepartment(ctx.getClientInfo(), ctx.getCompany(), id);
    };
    return execute(Method.GET, "department/{id}", executor);
  }

  @ApiOperation(value = "Find the children hr department", responseContainer = "List", response = HRDepartment.class)
  @GetMapping("department/{groupId}/children")
  public @ResponseBody RestResponse findHRDepartmentChildren(HttpSession session,
      @PathVariable("groupId") Long groupId) {
    final Long realGroupId = groupId <= 0 ? null : groupId;
    Callable<List<HRDepartment>> executor = () -> {
      ClientContext ctx = getClientContext(session);
      return hrService.findHRDepartmentChildren(ctx.getClientInfo(), ctx.getCompany(), realGroupId);
    };
    return execute(Method.GET, "department/{groupId}/children", executor);
  }

  @ApiOperation(value = "Save the hr department ", response = HRDepartment.class)
  @PutMapping("department")
  public @ResponseBody RestResponse saveHRDepartment(HttpSession session, @RequestBody HRDepartment department) {
    Callable<HRDepartment> executor = () -> {
      ClientContext ctx = getClientContext(session);
      return hrService.saveHRDepartment(ctx.getClientInfo(), ctx.getCompany(), department);
    };
    return execute(Method.PUT, "department", executor);
  }
  
  @ApiOperation(value = "Search HR Department", responseContainer = "List", response = HRDepartment.class)
  @PostMapping("department/search")
  public @ResponseBody RestResponse searchHRDepartment(HttpSession session, @RequestBody SqlQueryParams params) {
    Callable<List<HRDepartment>> executor = () -> {
      ClientContext ctx = getClientContext(session);
      return hrService.searchHRDepartment(ctx.getClientInfo(), ctx.getCompany(), params);
    };
    return execute(Method.POST,"department/search", executor);
  }
  
  @ApiOperation(value = "Delete the hr department ", response = Boolean.class)
  @DeleteMapping("department/{id}")
  public @ResponseBody RestResponse deleteHRDepartment(HttpSession session, @PathVariable("id") Long id) {
    Callable<Boolean> executor = () -> {
      ClientContext ctx = getClientContext(session);
      return hrService.deleteHRDepartment(ctx.getClientInfo(), ctx.getCompany(), id);
    };
    return execute(Method.DELETE, "department", executor);
  }
  
  @ApiOperation(value = "Save the hr department relations", response = Boolean.class)
  @PutMapping("department/{departmentId}/relations")
  public @ResponseBody RestResponse createHRDepartmentRelations(
      HttpSession session, @PathVariable("departmentId") Long departmentId, @RequestBody List<Long> employeeIds) {
    Callable<Boolean> executor = () -> {
      ClientContext ctx = getClientContext(session);
      hrService.createHRDepartmentRelations(ctx.getClientInfo(), ctx.getCompany(), departmentId, employeeIds);
      return true;
    };
    return execute(Method.PUT, "department/{departmentId}/relations", executor);
  }
  
  @ApiOperation(value = "Delete the hr department relations", response = Boolean.class)
  @DeleteMapping("department/{departmentId}/relations")
  public @ResponseBody RestResponse deleteHRDepartmentRelations(
      HttpSession session, @PathVariable("departmentId") Long departmentId, @RequestBody List<Long> employeeIds) {
    Callable<Boolean> executor = () -> {
      ClientContext ctx = getClientContext(session);
      hrService.deleteHRDepartmentRelations(ctx.getClientInfo(), ctx.getCompany(), departmentId, employeeIds);
      return true;
    };
    return execute(Method.DELETE, "department/{departmentId}/relations", executor);
  }

  @ApiOperation(value = "Retrieve the employee", response = Employee.class)
  @GetMapping("employee/{loginId}")
  public @ResponseBody RestResponse getEmployee(HttpSession session, @PathVariable("loginId") String loginId) {
    Callable<Employee> executor = () -> {
      ClientContext ctx = getClientContext(session);
      return hrService.getEmployee(ctx.getClientInfo(), ctx.getCompany(), loginId);
    };
    return execute(Method.GET, "employee/{loginId}", executor);
  }
  
  @ApiOperation(value = "Create the employee", response = Employee.class)
  @PutMapping("employee")
  public @ResponseBody RestResponse saveEmployee(HttpSession session, @RequestBody Employee employee) {
    Callable<Employee> executor = () -> {
      ClientContext ctx = getClientContext(session);
      Account account = accountService.getAccount(ctx.getClientInfo(), employee.getLoginId());
      return hrService.createEmployee(ctx.getClientInfo(), ctx.getCompany(), account, employee);
    };
    return execute(Method.PUT, "employee", executor);
  }

  @ApiOperation(value = "Create New Employee", response = Employee.class)
  @PutMapping("employee/create")
  public @ResponseBody RestResponse createPartnerModel(HttpSession session, @RequestBody NewEmployeeModel model) {
    Callable<Employee> executor = () -> {
      ClientContext ctx = getClientContext(session);
      return hrService.createEmployee(ctx.getClientInfo(), ctx.getCompany(), model);
    };
    return execute(Method.PUT, "employee/create", executor);
  } 

  @ApiOperation(value = "Search Employees", responseContainer = "List", response = Map.class)
  @PostMapping("employee/search")
  public @ResponseBody RestResponse searchEmployees(HttpSession session, @RequestBody SqlQueryParams params) {
    Callable<List<SqlMapRecord>> executor = () -> {
      ClientContext ctx = getClientContext(session);
      return hrService.searchEmployees(ctx.getClientInfo(), ctx.getCompany(), params);
    };
    return execute(Method.POST, "employees/search", executor);
  }

  @ApiOperation(value = "Change the employees state", response = Boolean.class)
  @PutMapping("employee/storage-state")
  public @ResponseBody RestResponse changeStorageState(HttpSession session, @RequestBody ChangeStorageStateRequest req) {
    Callable<Boolean> executor = () -> {
      ClientContext ctx = getClientContext(session);
      return hrService.changeEmployeesStorageState(getAuthorizedClientInfo(session), ctx.getCompany(), req);
    };
    return execute(Method.PUT, "employees/storage-state", executor);
  }
}
