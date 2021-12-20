package com.devteam.module.company.core.plugin;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.module.company.core.CompanyService;
import com.devteam.module.company.core.entity.Company;
import org.springframework.stereotype.Component;


@Component
public class MonitorCompanyServicePlugin extends CompanyServicePlugin {
  
  public MonitorCompanyServicePlugin() {
    super("company", CompanyService.class.getSimpleName(), "monitor");
  }

  @Override
  public void onPreSave(ClientInfo client, Company company, boolean isNew) {
  }

  @Override
  public void onPostSave(ClientInfo client, Company company, boolean isNew) {
  }

}
