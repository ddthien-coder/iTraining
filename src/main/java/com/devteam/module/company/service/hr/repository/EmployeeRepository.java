package com.devteam.module.company.service.hr.repository;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import com.devteam.core.module.data.db.entity.StorageState;
import com.devteam.core.module.data.db.repository.BaseRepository;
import com.devteam.module.company.service.hr.entity.Employee;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface EmployeeRepository extends BaseRepository<Employee, Serializable> {
  @Query("SELECT e from Employee e WHERE e.companyId = :companyId AND e.loginId = :loginId")
  public Employee getByLoginId(@Param("companyId") Long companyId, @Param("loginId") String loginId);

  @Query(
    "SELECT e from Employee e, HRDepartmentEmployeeRelation r " +
    "  WHERE e.id = r.employeeId AND r.departmentId = :departmentId"
  )
  List<Employee> findByDepartmentId(@Param("departmentId") Long departmentId);
  
  @Query("SELECT e FROM Employee e WHERE e.id IN :ids")
  public List<Employee> findByIds(@Param("ids") List<Long> ids) ;
  
  @Query("SELECT e FROM Employee e WHERE e.companyId = :companyId")
  public List<Employee> findByCompanyId(@Param("companyId") Long companyId) ;
  
  @Modifying
  @Query("update Employee e SET e.storageState = :state WHERE e.id IN :ids")
  int setStorageState(@Param("ids") Collection<Long> ids, @Param("state") StorageState state);
  
}
