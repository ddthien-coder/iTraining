package com.devteam.module.company.service.hr.plugin;


import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.StorageState;
import com.devteam.core.module.data.db.plugin.ServicePlugin;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.service.hr.entity.Employee;

public abstract class EmployeeServicePlugin extends ServicePlugin {

  protected EmployeeServicePlugin(String type) {
    super("employee", "EmployeeService", type);
  }
  
  public void onPreSave(ClientInfo client, Company company, Employee employee, boolean isNew) {
  }

  public void onPostSave(ClientInfo client, Company company, Employee employee, boolean isNew) {
  }

  public void onPreStateChange(ClientInfo client, Company company, Employee employee, StorageState newState) {
  }

  public void onPostStateChange(ClientInfo client, Company company, Employee employee, StorageState newState) {
  }
}
