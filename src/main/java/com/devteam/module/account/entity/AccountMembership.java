package com.devteam.module.account.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.devteam.core.module.data.db.entity.PersistableEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
  name = AccountMembership.TABLE_NAME,
  indexes = {
    @Index(columnList="group_id"),
    @Index(columnList="login_id")
  }
)
@NoArgsConstructor
@Getter @Setter
public class AccountMembership extends PersistableEntity<Long> {
  public static final String TABLE_NAME = "account_membership";
  
  public static enum Status { ACTIVE, INACTIVE, SUSPENDED }

  @NotNull
  @Column(name="login_id")
  private String loginId;

  @NotNull
  @Column(name="group_id")
  private Long groupId;

  @NotNull
  private Status status = Status.ACTIVE ;

  private String role ;
  
  
  public AccountMembership(Account account, AccountGroup group) {
    this.loginId = account.getLoginId() ;
    this.groupId = group.getId();
  }
  
  public AccountMembership(String loginId, Long groupId) {
    this.loginId    =  loginId ;
    this.groupId  = groupId;
  }
  
  public AccountMembership(String loginId, Long groupId, String role) {
    this.loginId    =  loginId ;
    this.groupId  = groupId;
    this.role = role;
  }

  public AccountMembership withLoginId(String loginId) {
    this.loginId = loginId;
    return this;
  }
}
