package com.ddthien.itraining.module.employee.entity;

import com.ddthien.itraining.core.entity.PersistableEntity;
import com.ddthien.itraining.module.account.entity.Account;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "employee")
@JsonInclude(Include.NON_NULL)
@Getter
@Setter
public class Employee extends PersistableEntity<Long> {
    @NotNull
    @OneToOne(optional = false)
    @JoinColumn(name = "accountId")
    private Account account;

    private Date startDate;

    public Employee() {
    }
}
