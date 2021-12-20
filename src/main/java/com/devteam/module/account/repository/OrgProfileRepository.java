package com.devteam.module.account.repository;

import java.io.Serializable;

import com.devteam.core.module.data.db.entity.StorageState;
import com.devteam.core.module.data.db.repository.BaseRepository;
import com.devteam.module.account.entity.OrgProfile;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface OrgProfileRepository extends BaseRepository<OrgProfile, Serializable> {
  public OrgProfile getByLoginId(String loginId);
  
  @Modifying
  @Query("update OrgProfile a SET a.storageState = :state WHERE a.loginId = :loginId")
  int setStorageState(@Param("loginId") String loginId, @Param("state") StorageState state);
  
  public long deleteByLoginId(String loginId);
}
