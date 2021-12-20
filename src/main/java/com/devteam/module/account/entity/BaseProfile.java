package com.devteam.module.account.entity;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@JsonInclude(Include.NON_NULL)
@Getter @Setter
public class BaseProfile extends PersistableEntity<Long> {
  private static final long serialVersionUID = 1L;

  @Column(name="login_id", unique =true)
  protected String loginId;
  protected String email;
  protected String mobile;

  @Column(name = "full_name")
  protected String fullName;

  @Column(name = "avatar_url")
  protected String avatarUrl;

}
