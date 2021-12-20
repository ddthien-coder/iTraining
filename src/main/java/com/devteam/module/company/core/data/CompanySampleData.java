package com.devteam.module.company.core.data;


import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.sample.SampleData;
import com.devteam.module.company.core.entity.Company;

abstract public class CompanySampleData extends SampleData {
  protected Company company;

  public void init(ClientInfo client, Company company) {
    this.client = client;
    this.company = company;
    initialize(client, company);
  }

  abstract protected void initialize(ClientInfo client, Company company);

}