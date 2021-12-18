package com.ddthien.itraining.module.account.service;

import com.ddthien.itraining.module.account.entity.AccountGroup;
import com.ddthien.itraining.module.account.repository.AccountGroupRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class AccountGroupLogic {

     @Autowired
     private AccountGroupRepository repo;

    public AccountGroup saveAccountGroup(AccountGroup gr) {
        return repo.save(gr);
    }

    public List<AccountGroup> findAll() {
        return repo.findAll();
    }
}
