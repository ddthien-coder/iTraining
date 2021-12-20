/**
 * 
 */
package com.devteam.core.module.security.repository;

import java.io.Serializable;
import java.util.List;

import com.devteam.core.module.security.entity.AppPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface AppPermissonRepository extends JpaRepository<AppPermission, Serializable>{
  
  List<AppPermission> findByCompanyIdAndLoginId(Long companyId, String loginId);
}
