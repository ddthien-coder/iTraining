package com.devteam.module.company.core;

import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.query.SqlQueryParams;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.core.entity.CompanyConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.Getter;

@Service
public class CompanyService {
  @Getter
  @Autowired
  private CompanyLogic companyLogic;

  @Getter
  @Autowired
  private CompanyConfigLogic configLogic;
  
  @Transactional
  public Company getCompany(ClientInfo clientInfo, Long id) {
    return companyLogic.getCompany(clientInfo, id);
  }
  
  
  @Transactional
  public Company getCompany(ClientInfo clientInfo, String companyCode) {
    return companyLogic.getCompany(clientInfo, companyCode);
  }
  
  @Transactional
  public Company createCompany(ClientInfo clientInfo, Company company) {
    return companyLogic.createCompany(clientInfo, company);
  }
  
  @Transactional
  public Company saveCompany(ClientInfo clientInfo, Company company) {
    return companyLogic.saveCompany(clientInfo, company);
  }

  @Transactional
  public List<Company> searchCompanies(ClientInfo client, SqlQueryParams params) {
    return companyLogic.searchCompanies(client, params);
  }

  @Transactional(readOnly = true)
  public CompanyConfig getCompanyConfig(ClientInfo clientInfo, Long companyId) {
    return configLogic.getCompanyConfig(clientInfo, companyId);
  }

  @Transactional
  public CompanyConfig saveCompanyConfig(ClientInfo clientInfo, Company company, CompanyConfig companyConfig) {
    return configLogic.saveCompanyConfig(clientInfo, company, companyConfig);
  }
}
