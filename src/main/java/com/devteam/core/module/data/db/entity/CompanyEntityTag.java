package com.devteam.core.module.data.db.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;

import com.devteam.core.module.common.ClientInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor @Getter @Setter
public class CompanyEntityTag extends PersistableEntity<Long> {
  @Column(name="company_id")
  private Long   companyId;

  @NotNull
  private String name;
  private String label;
  private String description;

  public CompanyEntityTag(String name, String label) {
    this.name    = name;
    this.label   = label;
  }

  public <T extends CompanyEntityTag> T withName(String name) {
    this.name = name;
    return (T)this;
  }

  public <T extends CompanyEntityTag> T withLabel(String label) {
    this.label = label;
    return (T)this;
  }

  public <T extends CompanyEntityTag> T withDescription(String desc) {
    this.description = desc;
    return (T)this;
  }
 
  public void set(ClientInfo client, Long companyId) {
    this.companyId = companyId;
  }

  static public <T extends CompanyEntityTag> void set(List<T> holder, ClientInfo client, Long companyId) {
    if(holder == null) return;
    for(T sel : holder) {
      sel.set(client, companyId);
    }
  }
}