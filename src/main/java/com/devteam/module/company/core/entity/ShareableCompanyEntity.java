package com.devteam.module.company.core.entity;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@Getter @Setter
abstract public class ShareableCompanyEntity extends CompanyEntity {
  private static final long serialVersionUID = 1L;

  @Enumerated(EnumType.STRING)
  private ShareableScope shareable = ShareableScope.COMPANY ;
  
  public <T extends ShareableCompanyEntity> T withScope(ShareableScope scope) {
    this.shareable = scope;
    return (T) this;
  }
}
