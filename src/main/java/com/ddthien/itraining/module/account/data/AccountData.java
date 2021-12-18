package com.ddthien.itraining.module.account.data;

import com.ddthien.itraining.core.data.DataDB;
import com.ddthien.itraining.core.entity.EntityAttribute;
import com.ddthien.itraining.module.account.entity.Account;
import com.ddthien.itraining.module.account.entity.Account.AccountType;
import com.ddthien.itraining.module.account.entity.AccountGroup;
import com.ddthien.itraining.module.account.entity.AccountMembership;
import com.ddthien.itraining.module.account.repository.AccountMembershipRepository;
import com.ddthien.itraining.module.account.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;

public class AccountData {

    public Account ADMIN ;

    public Account ADMIN_ORG ;

    public Account[] ALL ;

    public AccountData initialize(ApplicationContext ctx) {
        GroupData GROUP = DataDB.getInstance().getData(GroupData.class);
        AccountRepository repo = ctx.getBean(AccountRepository.class);
        AccountMembershipRepository mRepo = ctx.getBean(AccountMembershipRepository.class);

        ADMIN = repo.save(createUser("admin"));
        mRepo.save(createMembership(ADMIN, GROUP.HR));
        mRepo.save(createMembership(ADMIN, GROUP.IT));

        ADMIN_ORG = repo.save(createOrganization("admin"));

        ALL = new Account[] {ADMIN, ADMIN_ORG };
        return this;
    }

    static public Account createUser(String loginId) {
        Account user = new Account();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setAccountType(AccountType.User);
        user.setLoginId(loginId);
        user.setPassword(passwordEncoder.encode("admin@123")) ;
        user.setEmail(loginId + "@host.com") ;
        user.setFullName(loginId);
        user.setCreatedBy("ddthien");
        user.add(new EntityAttribute("birthday", new Date()));
        user.add(new EntityAttribute("id", "id"));
        return user ;
    }

    static public Account createOrganization(String loginId) {
        Account orgAccount = new Account();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        orgAccount.setAccountType(AccountType.Organization);
        orgAccount.setLoginId(loginId);
        orgAccount.setPassword(passwordEncoder.encode("admin@123")) ;
        orgAccount.setEmail(loginId + "@host.com") ;
        orgAccount.setFullName(loginId);
        orgAccount.setCreatedBy("ddthien");
        orgAccount.add(new EntityAttribute("foundedDate", new Date()));
        return orgAccount ;
    }

    static public AccountMembership createMembership(Account account, AccountGroup group) {
        AccountMembership m = new AccountMembership();
        m.setLoginId(account.getLoginId());
        m.setGroupPath(group.getPath());
        return m;
    }

    static public AccountMembership createMembership(String loginId, String groupPath) {
        AccountMembership m = new AccountMembership();
        m.setLoginId(loginId);
        m.setGroupPath(groupPath);
        return m;
    }
}
