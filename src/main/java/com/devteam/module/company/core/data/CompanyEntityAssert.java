package com.devteam.module.company.core.data;


import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.sample.PersistableEntityAssert;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.core.entity.CompanyEntity;

public class CompanyEntityAssert<T extends CompanyEntity> extends PersistableEntityAssert<T> {
  protected Company company;
  
  protected CompanyEntityAssert() {
  }
  
  protected CompanyEntityAssert(ClientInfo client, Company company, T entity) {
    init(client, company, entity);
  }
  
  protected void init(ClientInfo client, Company company, T entity) {
    init(client, entity);
    this.company = company;
  }
}
