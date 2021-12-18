package com.ddthien.itraining.module.account.entity;

import com.ddthien.itraining.core.entity.AbstractPersistable;
import com.ddthien.itraining.core.entity.EntityAttribute;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "account",
        indexes = {
                @Index(columnList="loginId"),
        }
)
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor @Setter @Getter
public class Account extends AbstractPersistable<Long> {
    static public enum AccountType { User, Organization }

    @Enumerated(EnumType.STRING)
    private AccountType accountType = AccountType.User;
    private String loginId ;
    private String password;

    private String email ;
    private String fullName;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "AccountAttribute")
    private List<EntityAttribute> attributes;

    public Account(String loginId) {
        this.loginId = loginId;
    }

    public Account withEmail(String email) {
        this.email = email;
        return this;
    }

    public Account withFullname(String fullName) {
        this.fullName = fullName;
        return this;
    }

    public void add(EntityAttribute attr) {
        if(attributes == null) attributes = new ArrayList<EntityAttribute>();
        attributes.add(attr);
    }
}

