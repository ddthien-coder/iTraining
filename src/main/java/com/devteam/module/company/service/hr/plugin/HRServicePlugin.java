package com.devteam.module.company.service.hr.plugin;


import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.StorageState;
import com.devteam.core.module.data.db.plugin.ServicePlugin;
import com.devteam.module.company.service.hr.entity.Employee;

abstract public class HRServicePlugin extends ServicePlugin {
  
  protected HRServicePlugin(String module, String service, String type) {
    super(module, service, type);
  }

  public void onPreSave(ClientInfo client, Employee employee) {
  }

  public void onPostSave(ClientInfo client, Employee employee) {
  }
  
  public void onPreStateChange(ClientInfo client, Employee employee, StorageState newState) {
  }

  public void onPostStateChange(ClientInfo client, Employee employee, StorageState newState) {
  }
}
