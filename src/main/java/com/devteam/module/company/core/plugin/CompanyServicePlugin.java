package com.devteam.module.company.core.plugin;


import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.plugin.ServicePlugin;
import com.devteam.module.company.core.entity.Company;

abstract public class CompanyServicePlugin extends ServicePlugin {
  
  protected CompanyServicePlugin(String module, String service, String type) {
    super(module, service, type);
  }

  public void onPreSave(ClientInfo client, Company company, boolean isNew) {
  }

  public void onPostSave(ClientInfo client, Company company, boolean isNew) {
  }
}
