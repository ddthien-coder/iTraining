
package com.devteam.module.account.repository;

import java.io.Serializable;
import java.util.List;

import com.devteam.core.module.data.db.repository.BaseRepository;
import com.devteam.module.account.entity.AccountGroup;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountGroupRepository extends BaseRepository<AccountGroup, Serializable> {
  
  @Query("SELECT g FROM AccountGroup g WHERE g.name = :name")
  public AccountGroup getByName(@Param("name") String name);
  
  @Query("SELECT g FROM AccountGroup g WHERE g.parentId is null")
  public List<AccountGroup> findRootChildren();
  
  @Query("SELECT g FROM AccountGroup g WHERE g.parentId = :parentId")
  public List<AccountGroup> findChildren(@Param("parentId") Long parentId);
}