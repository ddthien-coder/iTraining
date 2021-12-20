package com.devteam.module.account.repository;

import java.io.Serializable;
import java.util.List;

import com.devteam.core.module.data.db.entity.StorageState;
import com.devteam.core.module.data.db.repository.BaseRepository;
import com.devteam.module.account.entity.Account;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountRepository extends BaseRepository<Account, Serializable> {
  public Account getByLoginId(String loginId) ;
  public Account getByEmail(String email) ;
  
  @Modifying
  @Query("update Account a SET a.storageState = :state WHERE a.loginId = :loginId")
  int setStorageState(@Param("loginId") String loginId, @Param("state") StorageState state);
  
  @Query("SELECT a FROM Account a WHERE a.id IN :ids")
  public List<Account> findAccounts(@Param("ids") List<Long> ids) ;
}