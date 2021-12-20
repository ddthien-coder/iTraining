package com.devteam.module.company.service.hr.repository;

import java.io.Serializable;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.devteam.core.module.data.db.repository.BaseRepository;
import com.devteam.module.company.service.hr.entity.HRDepartment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface HRDepartmentRepository extends BaseRepository<HRDepartment, Serializable> {
  HRDepartment getById(@NotNull Long id);

  @Query(
      "SELECT d FROM  HRDepartment d WHERE d.companyId = :companyId AND d.id = :id"
  )
  HRDepartment getById(@Param("companyId") Long companyId, @Param("id") Long id);


  @Query(
    "SELECT d FROM  HRDepartment d WHERE d.companyId = :companyId AND d.name = :name"
  )
  HRDepartment getByName(@Param("companyId") Long companyId, @Param("name") String name);

  @Query(
    "SELECT d FROM  HRDepartment d WHERE d.companyId = :companyId AND d.parentId is null ORDER BY d.label ASC"
  )
  List<HRDepartment> findRootChildren(@Param("companyId") Long companyId);

  
  @Query(
    "SELECT d FROM  HRDepartment d WHERE d.companyId = :companyId AND d.parentId = :parentId ORDER BY d.label ASC"
  )
  List<HRDepartment> findChildren(@Param("companyId") Long companyId, @Param("parentId")Long parentId);
}
