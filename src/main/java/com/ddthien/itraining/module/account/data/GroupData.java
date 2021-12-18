package com.ddthien.itraining.module.account.data;

import com.ddthien.itraining.core.entity.EntityAttribute;
import com.ddthien.itraining.module.account.entity.AccountGroup;
import com.ddthien.itraining.module.account.repository.AccountGroupRepository;
import org.springframework.context.ApplicationContext;

public class GroupData {
    public AccountGroup HR ;
    public AccountGroup IT ;
    public AccountGroup IT_DEVELOPER ;

    public AccountGroup[] ALL ;

    public GroupData initialize(ApplicationContext ctx) {
        AccountGroupRepository repo = ctx.getBean(AccountGroupRepository.class);

        HR = createAccountGroup(null, "hr");
        repo.save(HR);

        IT = createAccountGroup(null, "it");
        repo.save(IT);

        IT_DEVELOPER = createAccountGroup(IT, "developer");
        repo.save(IT_DEVELOPER);

        ALL = new AccountGroup[] {HR, IT, IT_DEVELOPER} ;
        return this;
    }


    static public AccountGroup createAccountGroup(AccountGroup parent, String name) {
        AccountGroup accGroup = new AccountGroup();
        accGroup.setName(name);
        accGroup.withParent(parent);
        accGroup.setAttributes(new EntityAttribute("child", "child"));
        return accGroup;
    }
}
