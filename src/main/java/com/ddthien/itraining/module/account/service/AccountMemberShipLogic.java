package com.ddthien.itraining.module.account.service;

import com.ddthien.itraining.module.account.entity.AccountMembership;
import com.ddthien.itraining.module.account.repository.AccountMembershipRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AccountMemberShipLogic {

    @Autowired
    private AccountMembershipRepository membershipRepo;

    AccountMembership createAccountMembership(AccountMembership relation) {
        return membershipRepo.save(relation);
    }
}
