package com.ddthien.itraining.module.account.entity;

import com.ddthien.itraining.core.entity.PersistableEntity;
import com.ddthien.itraining.lib.util.text.StringUtil;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Entity
@Table(
        name = "AccountMembership",
        uniqueConstraints = @UniqueConstraint(
                columnNames = { "loginId", "groupPath" }
        )
)
public class AccountMembership extends PersistableEntity<Long> {

    @NotNull
    public String loginId;

    @NotNull
    private String groupPath;

    public AccountMembership() {
    }

    public AccountMembership(Account account, AccountGroup group) {
        this.loginId   = account.getLoginId();
        this.groupPath = group.getPath();
    }

    public AccountMembership(String loginId, String groupPath) {
        this.loginId   = loginId;
        this.groupPath = groupPath;
    }

    public String getLoginId() {
        return loginId;
    }

    public void setLoginId(String loginId) {
        if (StringUtil.isEmpty(loginId))
            this.loginId = null;
        else
            this.loginId = loginId;
    }

    public String getGroupPath() {
        return groupPath;
    }

    public void setGroupPath(String path) {
        if (StringUtil.isEmpty(path))
            groupPath = null;
        groupPath = path;
    }
}

