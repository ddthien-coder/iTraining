package com.devteam.module.company.core.entity;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.ICompanyEntity;
import com.devteam.core.module.data.db.entity.Persistable;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@Getter @Setter
abstract public class CompanyPersistable extends Persistable<Long> implements ICompanyEntity {
  private static final long serialVersionUID = 1L;

  @NotNull @Min(1)
  @Column(name="company_id")
  protected Long   companyId;

  public void set(ClientInfo client, Company company) {
    super.set(client); 
    this.companyId = company.getId();
  }
  
  public void set(ClientInfo client, Long companyId) { 
    super.set(client); 
    this.companyId = companyId;
  }
}
