package com.devteam.core.module.security.entity;

import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.devteam.core.module.data.db.entity.Persistable;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@JsonInclude(Include.NON_NULL)
@Table(
  name = AppRole.TABLE_NAME,
  indexes = { 
    @Index(columnList = "role")
  }
)
@NoArgsConstructor @Getter @Setter
public class AppRole extends Persistable<Long> {
  private static final long serialVersionUID = 1L;

  public static final String TABLE_NAME = "security_app_role";

  @NotNull
  private String     role;

  @NotNull
  private String     label;
}
