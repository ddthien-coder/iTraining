package com.devteam.module.company.core;

import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.DBScenario;
import com.devteam.core.module.data.db.DBService;
import com.devteam.core.module.data.db.DBServicePlugin;
import com.devteam.module.company.core.data.CompanyDBModuleScenario;
import com.devteam.module.company.core.data.CompanyData;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.core.plugin.MonitorCompanyServicePlugin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


@Component
@Order(value = DBServicePlugin.COMPANY)
public class CompanyDBServicePlugin extends DBServicePlugin {
  
  @Autowired
  private CompanyLogic companyLogic;

  @Autowired
  private MonitorCompanyServicePlugin monitorPlugin;
  
  @Override
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void initDb(ClientInfo client, ApplicationContext context) throws Exception {
    monitorPlugin.createPluginInfo(client);
    
    Company company = new Company(CompanyData.DEFAULT_COMPANY_CODE, "My Company").withLoginAccountLoginId("admin");
    company = companyLogic.saveCompany(client, company);
  }

  @Override
  public void createSammpleData(ClientInfo client,  ApplicationContext context) throws Exception {
    new DBScenario(context)
    .add(CompanyDBModuleScenario.class)
    .initialize(client);
  }
  
  @Override
  public void postInitDb(ClientInfo client, DBService service, ApplicationContext context, boolean initSample) throws Exception {
    List<Company> companies = companyLogic.findAll(client);
    for(Company company : companies) {
      companyLogic.initCompanyDb(client, company, initSample);
    }
  }

  public <T> void initCompanyDb(ClientInfo client, T companyCtx,  ApplicationContext context) throws Exception {
  }
  
  public <T> void createSammpleData(ClientInfo client, T companyCtx, ApplicationContext context) throws Exception {
  }
}
