package com.devteam.module.company.core.entity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.ICompanyEntity;
import com.devteam.core.module.data.db.entity.Persistable;
import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor @Getter @Setter
abstract public class CompanyEntity extends PersistableEntity<Long> implements ICompanyEntity {
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

  protected <T extends ICompanyEntity> void set(ClientInfo client, Company company, T entity) {
    if(entity == null) return; 
    if(entity instanceof CompanyEntity) {
      ((CompanyEntity)entity).set(client, company);
    } else {
      entity.set(client, company.getId());
    }
  }

  protected <T extends ICompanyEntity> void set(ClientInfo client, Company company, Collection<T> entities) {
    if(entities != null) {
      for(T sel : entities) {
        if(sel instanceof CompanyEntity) {
          ((CompanyEntity)sel).set(client, company);
        } else {
          sel.set(client, company.getId());
        }
      }
    }
  }

  protected <T extends CompanyEntityAttribute> void setAttributes(ClientInfo client, Company company, Collection<T> entities) {
    if(entities != null) {
      for(T sel : entities) sel.set(client, company.getId());
    }
  }

  protected <T extends Persistable<Long>> List<T> replace(List<T> target, List<T> source) {
    if(target == null) target = new ArrayList<T>();
    else target.clear();
    if(source != null) target.addAll(source);
    return target;
  }
}
