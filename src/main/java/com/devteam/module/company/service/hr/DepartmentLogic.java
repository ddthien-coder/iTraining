package com.devteam.module.company.service.hr;

import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.DAOService;
import com.devteam.core.module.data.db.query.*;
import com.devteam.core.util.ds.Objects;
import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;
import com.devteam.core.util.text.StringUtil;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.service.hr.entity.Employee;
import com.devteam.module.company.service.hr.entity.HRDepartment;
import com.devteam.module.company.service.hr.entity.HRDepartmentEmployeeRelation;
import com.devteam.module.company.service.hr.repository.EmployeeRepository;
import com.devteam.module.company.service.hr.repository.HRDepartmentEmployeeRelationRepository;
import com.devteam.module.company.service.hr.repository.HRDepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DepartmentLogic extends DAOService {
  @Autowired
  private HRDepartmentRepository departmentRepo;

  @Autowired
  private EmployeeRepository employeeRepo;
  
  @Autowired
  private HRDepartmentEmployeeRelationRepository deptEmplRelRepo;
  
  //Company Department
  public HRDepartment getHRDepartment(ClientInfo client, Company company, Long id) {
    return departmentRepo.getById(company.getId(), id);
  }
  
  public HRDepartment getHRDepartment(ClientInfo client, Company company, String name) {
    return departmentRepo.getByName(company.getId(), name);
  }

  public List<HRDepartment> findHRDepartmentChildren(ClientInfo client, Company company, Long groupId) {
    if(groupId == null) return departmentRepo.findRootChildren(company.getId());
    return departmentRepo.findChildren(company.getId(), groupId);
  }
  
  public HRDepartmentModel loadHRDepartmentModel(ClientInfo clientInfo, Company company, HRDepartmentModelRequest req) {
    HRDepartmentModel model = new HRDepartmentModel();
    if(req.getId() == null && StringUtil.isEmpty(req.getName())) {
      List<HRDepartment> children = departmentRepo.findRootChildren(company.getId());
      model.withChildren(children);
      return model;
    }
    HRDepartment department = null;
    if(req.getId() != null) {
      department = departmentRepo.getById(company.getId(), req.getId());
    } else if(req.getName() != null) {
      department = departmentRepo.getByName(company.getId(), req.getName());
    } else {
      throw new RuntimeError(ErrorType.EntityNotFound, "Expect either department id or name!");
    }
    if(department == null) return null;
    model.withDepartment(department);
    
    if(req.isLoadChildren()) {
      List<HRDepartment> children = departmentRepo.findChildren(company.getId(), department.getId());
      model.withChildren(children);
    }
    
    if(req.isLoadEmployees()) {
      List<Employee> employees = employeeRepo.findByDepartmentId(department.getId());
      model.withEmployees(employees);
    }
    return model;
  }
  
  public HRDepartment createHRDepartment(ClientInfo clientInfo, Company company, HRDepartment parent, HRDepartment dept) {
    dept.set(clientInfo, company);
    dept.withParent(parent);
    return departmentRepo.save(dept);
  }
  
  public HRDepartment saveHRDepartment(ClientInfo clientInfo, Company company, HRDepartment dept) {
    dept.set(clientInfo, company);
    return departmentRepo.save(dept);
  }
  
  public List<HRDepartment> searchHRDepartment(ClientInfo client, Company company, SqlQueryParams params) {
    params.addParam("companyId", company.getId());
    SqlQuery query =
        new SqlQuery()
        .ADD_TABLE(new EntityTable(HRDepartment.class).selectAllFields())
        .FILTER(new ClauseFilter(HRDepartment.class, "companyId", "=", ":companyId"))
        .FILTER(
             SearchFilter.isearch(HRDepartment.class, new String[] {"name", "label", "description"}))
        .FILTER(
             OptionFilter.storageState(HRDepartment.class),
             RangeFilter.modifiedTime(HRDepartment.class))
        .ORDERBY(new String[] {"name", "modifiedTime"}, "modifiedTime", "DESC");
   
    return query(client, query, params, HRDepartment.class); 
  }

  public boolean createHRDepartmentRelations(ClientInfo clientInfo, Company company, Long departmentId, List<Long> employeeIds) {
    HRDepartment department = departmentRepo.getById(departmentId);
    Objects.assertNotNull(department, "Department cannot be null");
    if(Objects.nonNull(employeeIds)) {
      for(Long employeeId : employeeIds) {
        HRDepartmentEmployeeRelation relation = new HRDepartmentEmployeeRelation();
        relation.set(clientInfo, company);
        relation.setDepartmentId(departmentId);
        relation.setEmployeeId(employeeId);
        deptEmplRelRepo.save(relation);
      }
    }
    return true;
  }
  
  public boolean deleteHRDepartmentRelations(ClientInfo clientInfo, Company company, Long departmentId, List<Long> employeeIds) {
    HRDepartment department = departmentRepo.getById(departmentId);
    Objects.assertNotNull(department, "Department cannot be null");
    if(Objects.nonNull(employeeIds)) {
      for(Long employeeId : employeeIds) {
        HRDepartmentEmployeeRelation relation = deptEmplRelRepo.getRelationByDepartmentIdAndEmployeeId(departmentId, employeeId);
        deptEmplRelRepo.delete(relation);
      }
    }
    return true;
  }
  
  public Boolean delete(ClientInfo client, Company company, Long id) {
    HRDepartment department = departmentRepo.getById(id);
    List<HRDepartment> children = departmentRepo.findChildren(company.getId(), department.getId());
    if(children.size() > 0) {
      throw new RuntimeError(ErrorType.IllegalState, "Cannot delete  department " + department.getLabel() + ", that has the children");
    }
    departmentRepo.delete(department);
    deptEmplRelRepo.deleteById(department.getId());
    return true;
  }
}
