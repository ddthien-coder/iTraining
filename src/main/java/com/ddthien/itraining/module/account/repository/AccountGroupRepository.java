package com.ddthien.itraining.module.account.repository;

import java.util.List;

import com.ddthien.itraining.module.account.entity.AccountGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

@Repository
public interface AccountGroupRepository extends JpaRepository<AccountGroup, Long> {

    @Query("Select g from AccountGroup g where g.parentPath is null")
    List<AccountGroup> findRootGroup();

    @Query("Select g from AccountGroup g where g.path = :path")
    AccountGroup getByPath(@Param("path") String path);

    @Query("Select g from AccountGroup g where g.parentPath = :path")
    List<AccountGroup> getGroupChildren(@Param("path") String path);
}
