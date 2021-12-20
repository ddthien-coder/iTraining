package com.devteam.module.storage.entity;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.ICompanyEntity;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor @Getter @Setter
public class CompanyEntityAttachment extends EntityAttachment implements ICompanyEntity {
  @Column(name="company_id")
  private Long   companyId;
  
  public CompanyEntityAttachment(String name, String label, String description) {
    super(name, label, description);
  }

  public void set(ClientInfo client, Long companyId) {
    super.set(client);
    setCompanyId(companyId);
  }
  
}
 