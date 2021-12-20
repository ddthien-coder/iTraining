package com.devteam.module.account.repository;

import java.io.Serializable;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.devteam.core.module.data.db.entity.StorageState;
import com.devteam.core.module.data.db.repository.BaseRepository;
import com.devteam.module.account.entity.AccountMembership;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface AccountMembershipRepository extends BaseRepository<AccountMembership, Serializable> {
  public List<AccountMembership> findByGroupId(@NotNull Long groupId);
  public List<AccountMembership> findByLoginId(String loginId);
  
  public AccountMembership getMembershipByGroupIdAndLoginId(@Param("groupId") Long groupId, @Param("loginId") String loginId);

  @Modifying
  @Query("update AccountMembership m SET m.storageState = :state WHERE m.loginId = :loginId")
  int setStorageState(@Param("loginId") String loginId, @Param("state") StorageState state);

  @Modifying
  @Query("Delete from AccountMembership m where m.groupId = :groupId")
  public void deleteByGroup(@Param("groupId") Long groupId);
  
  public long deleteByLoginId(String loginId);
}