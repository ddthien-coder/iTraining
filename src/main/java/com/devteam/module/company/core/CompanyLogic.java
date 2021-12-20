package com.devteam.module.company.core;

import java.util.ArrayList;
import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.DAOService;
import com.devteam.core.module.data.db.DBService;
import com.devteam.core.module.data.db.query.*;
import com.devteam.core.util.ds.Objects;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.core.entity.CompanyConfig;
import com.devteam.module.company.core.plugin.CompanyServicePlugin;
import com.devteam.module.company.core.repository.CompanyConfigRepository;
import com.devteam.module.company.core.repository.CompanyRepository;
import com.devteam.module.storage.CompanyStorage;
import com.devteam.module.storage.IStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CompanyLogic extends DAOService {
  @Autowired
  private CompanyRepository companyRepo;

  @Autowired
  private CompanyConfigRepository companyConfigRepo;
  
  @Autowired
  private DBService dbService;

  @Autowired
  private IStorageService storageService;
  
  @Autowired(required = false)
  List<CompanyServicePlugin> plugins = new ArrayList<>();
  
  public Company getCompany(ClientInfo clientInfo, Long id) {
    return companyRepo.getById(id); 
  }

  public List<Company> findAll(ClientInfo clientInfo) { 
    return companyRepo.findAll(); 
  }

  public Company getCompany(ClientInfo clientInfo, String code) { 
    return companyRepo.getByCode(clientInfo, code); 
  }

  public Company saveCompany(ClientInfo clientInfo, Company company) { 
    log.info("Save company {}", company.getLabel());
    boolean isNew = company.isNew();

    if (Objects.nonNull(company.getParentId())) {
      Company parentCompany = companyRepo.getById(company.getParentId());
      if (parentCompany.getParentIdPath() == null) {
        company.setParentIdPath(Long.toString(parentCompany.getId()));
      } else {
        company.setParentIdPath(parentCompany.getParentIdPath() + "/" + parentCompany.getId());
      }
    } else {
      company.setParentIdPath(null);
    }
    
    for(CompanyServicePlugin plugin : plugins) {
      plugin.onPreSave(clientInfo, company, isNew);
    }

    company = companyRepo.save(clientInfo, company);
    
    if (isNew) {
      CompanyConfig config = new CompanyConfig(company.getLabel() + "-" + "Config");
      config.set(clientInfo);
      config.setCompanyId(company.getId());
      companyConfigRepo.save(config);
      CompanyStorage storage = storageService.createCompanyStorage(clientInfo, company.getCode());
      storage.initDirectory("www");
      storage.initDirectory("apps");
    }
    
    for(CompanyServicePlugin plugin : plugins) {
      plugin.onPostSave(clientInfo, company, isNew);
    }
    return company;
  }
  
  public Company createCompany(ClientInfo clientInfo, Company company) { 
    log.info("Create company {}", company.getLabel());
    Objects.assertTrue(company.isNew());
    return saveCompany(clientInfo, company);
  }

  public void initCompanyDb(ClientInfo clientInfo, Company company, boolean initSampleData) { 
    dbService.initCompanyDb(clientInfo, company, initSampleData);
  }

  List<Company> searchCompanies(ClientInfo client, SqlQueryParams params) {
    String[] SEARCH_FIELDS = new String[] { "code", "label", "description" };
    SqlQuery query =
        new SqlQuery().
        ADD_TABLE(new EntityTable(Company.class).selectAllFields()).
        FILTER(
             SearchFilter.isearch(Company.class, SEARCH_FIELDS)).
        FILTER(
             OptionFilter.storageState(Company.class)).
        ORDERBY(new String[] {"code", "modifiedTime"}, "modifiedTime", "DESC");
    query.mergeValue(params);
    return query(client, query, Company.class); 
  }
}
