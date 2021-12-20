package com.devteam.module.company.service.hr.repository;

import java.io.Serializable;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.devteam.core.module.data.db.repository.BaseRepository;
import com.devteam.module.company.service.hr.entity.HRDepartmentEmployeeRelation;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface HRDepartmentEmployeeRelationRepository extends BaseRepository<HRDepartmentEmployeeRelation, Serializable> {
  List<HRDepartmentEmployeeRelation> findByEmployeeId(@NotNull Long employeeId);

  List<HRDepartmentEmployeeRelation> findByDepartmentId(@NotNull Long departmentId);
  
  @Modifying
  @Query("Delete FROM HRDepartmentEmployeeRelation r where r.departmentId = :departmentId")
  public void deleteById(@Param("departmentId") Long departmentId);
  
  public HRDepartmentEmployeeRelation getRelationByDepartmentIdAndEmployeeId(@Param("departmentId") Long departmentId, @Param("employeeId") Long employeeId);
}
