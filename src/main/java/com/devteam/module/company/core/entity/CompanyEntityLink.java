package com.devteam.module.company.core.entity;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.EntityLink;
import com.devteam.core.module.data.db.entity.ICompanyEntity;
import com.devteam.core.module.data.db.entity.Persistable;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor
@Getter @Setter
public class CompanyEntityLink extends EntityLink implements ICompanyEntity {
  private static final long serialVersionUID = 1L;

  @Column(name = "company_id")
  private Long companyId;
  
  public CompanyEntityLink(Persistable<Long> entity) {
    super(entity);
  }

  public void set(ClientInfo client, Long companyId) {
    super.set(client); 
    this.companyId = companyId;
  }
}
