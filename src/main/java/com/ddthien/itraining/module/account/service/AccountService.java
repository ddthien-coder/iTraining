package com.ddthien.itraining.module.account.service;

import com.ddthien.itraining.module.account.entity.Account;
import com.ddthien.itraining.module.account.entity.AccountGroup;
import com.ddthien.itraining.module.account.entity.AccountMembership;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class AccountService {

    @Autowired
    private AccountLogic accountLogic;

    @Autowired
    private AccountGroupLogic accountGroupLogic;

    @Autowired
    private AccountMemberShipLogic accountMemberShipLogic;

    @Transactional
    public Account getAccount(String loginId) {
        // TODO: implement this method
        return null;
    }

    @Transactional
    public Account saveAccount(Account acc) {
        return accountLogic.saveAccount(acc);
    }

    @Transactional(readOnly = true)
    public List<Account> findAllAccounts() {
        return accountLogic.findAll();
    }

    @Transactional
    public AccountGroup getAccountGroup(String groupPath) {
        // TODO: implement this method
        return null;
    }

    @Transactional
    public AccountGroup saveAccountGroup(AccountGroup gr) {
        return accountGroupLogic.saveAccountGroup(gr);
    }

    @Transactional(readOnly = true)
    public List<AccountGroup> findAllAccountGroups() {
        return accountGroupLogic.findAll();
    }

    @Transactional
    public AccountMembership createAccountMembership(AccountMembership relation) {
        return accountMemberShipLogic.createAccountMembership(relation);
    }

}

