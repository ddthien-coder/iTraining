package com.devteam.module.company.core;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.core.entity.CompanyConfig;
import com.devteam.module.company.core.repository.CompanyConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class CompanyConfigLogic {
  @Autowired
  private CompanyConfigRepository companyConfigRepo;
  
  public CompanyConfig getCompanyConfig(ClientInfo client, Long companyId) {
    return companyConfigRepo.getByCompanyId(companyId);
  }

  public CompanyConfig saveCompanyConfig(ClientInfo client, Company company, CompanyConfig companyConfig) {
    return companyConfigRepo.save(client, company, companyConfig);
  }
}
