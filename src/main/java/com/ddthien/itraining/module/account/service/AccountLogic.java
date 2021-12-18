package com.ddthien.itraining.module.account.service;

import com.ddthien.itraining.module.account.entity.Account;
import com.ddthien.itraining.module.account.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AccountLogic {

    @Autowired
    private AccountRepository repo;

    public AccountLogic(AccountRepository repo) {
        this.repo = repo;
    }

    public Account saveAccount(Account account) {
        return repo.save(account);
    }

    public List<Account> findAll() {
        return repo.findAll();
    }

}
