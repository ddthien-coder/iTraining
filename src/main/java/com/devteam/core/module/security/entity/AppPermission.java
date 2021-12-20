package com.devteam.core.module.security.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.ICompanyEntity;
import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@JsonInclude(Include.NON_NULL)
@Table(
  name = AppPermission.TABLE_NAME,
  uniqueConstraints = {
    @UniqueConstraint(
      name = AppPermission.TABLE_NAME + "_login_id_app_id_company_id",
      columnNames = {"company_id", "login_id", "app_id"}
    ),
  },
  indexes = { 
    @Index(columnList = "login_id")
  }
)
@NoArgsConstructor @Getter @Setter
public class AppPermission extends PersistableEntity<Long> implements ICompanyEntity {
  private static final long serialVersionUID = 1L;

  public static final String TABLE_NAME = "security_app_permission";

  @NotNull
  @Column(name = "company_id")
  private Long       companyId;
  
  @ManyToOne(optional = false)
  @JoinColumn(name = "app_id")
  private App  app;
 
  @NotNull
  @Column(name = "login_id")
  private String     loginId;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(name = "access_type")
  private AccessType accessType = AccessType.Employee;
  
  @Column(name = "app_role")
  private String appRole;
  
  @Column(name = "app_role_label")
  private String appRoleLabel;
  
  @NotNull
  @Enumerated(EnumType.STRING)
  private Capability capability;

  public AppPermission(Long companyId, String loginId) {
    this.companyId = companyId;
    this.loginId = loginId;
  }
  
  public AppPermission withCapability(Capability capability) {
    this.capability = capability;
    return this;
  }
  
  public AppPermission withApp(App app) {
    this.app = app;
    return this;
  }
  
  public AppPermission withType(AccessType type) {
    this.accessType = type;
    return this;
  }

  @Override
  public void set(ClientInfo client, Long companyId) {
    super.set(client);
    this.companyId = companyId;
  }
}
