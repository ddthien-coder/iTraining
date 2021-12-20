package com.devteam.module.company.core.entity;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.EntityAttribute;
import com.devteam.core.module.data.db.entity.ICompanyEntity;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor
@Getter @Setter
public class CompanyEntityAttribute extends EntityAttribute implements ICompanyEntity {
  private static final long serialVersionUID = 1L;

  @Column(name = "company_id")
  private Long companyId;
  
  protected CompanyEntityAttribute(String name, Object val, String desc) {
    super(name, val, desc);
  }

  public void set(ClientInfo client, Long companyId) {
    super.set(client); 
    this.companyId = companyId;
  }
}
