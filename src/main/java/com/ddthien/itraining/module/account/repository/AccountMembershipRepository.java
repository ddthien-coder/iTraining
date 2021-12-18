package com.ddthien.itraining.module.account.repository;

import java.util.List;

import com.ddthien.itraining.module.account.entity.AccountMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

@Repository
public interface AccountMembershipRepository extends JpaRepository<AccountMembership, Long> {

    @Query("select m from AccountMembership m where m.loginId = :loginId")
    List<AccountMembership> findByAccountLogin(@Param("loginId") String loginId);

    @Query("select m from AccountMembership m where m.groupPath = :groupPath")
    List<AccountMembership> findByGroupPath(@Param("groupPath") String groupPath);

    @Query("select m from AccountMembership m where m.loginId = :loginId AND m.groupPath = :groupPath")
    AccountMembership findByAccountLoginAndGroupPath(@Param("loginId") String loginId,
                                                     @Param("groupPath") String groupPath);

}
