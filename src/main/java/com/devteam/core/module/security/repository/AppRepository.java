/**
 * 
 */
package com.devteam.core.module.security.repository;

import java.io.Serializable;
import java.util.List;

import com.devteam.core.module.security.entity.App;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface AppRepository extends JpaRepository<App, Serializable>{
  
  @Query("SELECT a FROM App a WHERE a.module = :module AND a.name = :name")
  public App getApp(@Param("module") String module, @Param("name") String name);
}
