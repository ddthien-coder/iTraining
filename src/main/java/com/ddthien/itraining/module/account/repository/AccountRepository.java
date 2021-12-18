package com.ddthien.itraining.module.account.repository;

import com.ddthien.itraining.module.account.entity.Account;
import com.ddthien.itraining.module.account.entity.Account.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.io.Serializable;
import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Serializable> {
    @Query("select a from Account a where a.loginId = :loginId AND a.accountType = :accountType")
    Account getByLoginId(@Param("loginId") String loginId, @Param("accountType") AccountType accountType);

    @Query("select o from Account o where lower(o.loginId) like %:loginId% AND o.accountType = :accountType")
    List<Account> findByLoginId(@Param("loginId") String loginId, @Param("accountType") AccountType accountType);
}
