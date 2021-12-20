package com.devteam.server.plugin;

import java.util.ArrayList;
import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.StorageState;
import com.devteam.core.module.security.SecurityLogic;
import com.devteam.core.module.security.entity.App;
import com.devteam.core.module.security.entity.AppPermission;
import com.devteam.core.module.security.entity.Capability;
import com.devteam.core.util.text.StringUtil;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.service.hr.entity.Employee;
import com.devteam.module.company.service.hr.plugin.EmployeeServicePlugin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EmployeeInitSecurityPlugin extends EmployeeServicePlugin {
  @Autowired
  SecurityLogic securityLogic;

  protected EmployeeInitSecurityPlugin() {
    super("employee-security");
  }
  
  public void onPreSave(ClientInfo client, Company company, Employee employee, boolean isNew) {
  }

  public void onPostSave(ClientInfo client, Company company, Employee employee, boolean isNew) {
    List<AppPermission> permissions = new ArrayList<>();
    if(StringUtil.isNotEmpty(company.getAdminAccountLoginId()) && company.getAdminAccountLoginId().equals(employee.getLoginId())) {
      permissions = initCompanyAdminAccountPermission(client, company, employee);
    } else {
      App mySpaceApp = securityLogic.getApp(client, "user", "my-space");
      permissions.add(new AppPermission(company.getId(), employee.getLoginId()).withCapability(Capability.Write).withApp(mySpaceApp));
    }
    
    securityLogic.saveAppPermissions(client, permissions);
  }
  
  public void onPostStateChange(ClientInfo client, Company company, Employee employee, StorageState newState) {
    if(newState.equals(StorageState.ARCHIVED)) {
      List<AppPermission> employeePermissions = securityLogic.findAppPermissions(client, company.getId(), employee.getLoginId());
      securityLogic.deletePermissions(client, employeePermissions);
    }
  }
  
  private List<AppPermission> initCompanyAdminAccountPermission(ClientInfo client,Company company, Employee employee) {
    List<AppPermission> permissions = new ArrayList<>();
    App[] apps = createApps();
    for(App selApp : apps) {
      App app = securityLogic.getApp(client, selApp.getModule(), selApp.getName());
      if(selApp.getName().equals("system") || selApp.getName().equals("sample")) {
        if(employee.getLoginId().equals("admin")) {
          AppPermission permission = 
              new AppPermission(company.getId(), employee.getLoginId()).withCapability(Capability.Admin).withApp(app);
          permissions.add(permission);
        }
      } else {
        AppPermission permission = 
            new AppPermission(company.getId(), employee.getLoginId()).withCapability(Capability.Admin).withApp(app);
        permissions.add(permission);
      }
    }
    return permissions;
  }
  
  private App[] createApps() {
    App[] apps = {
            new App("user", "my-space"),
            new App("admin", "admin"),
            new App("company", "company"),
            new App("system", "system"),
            new App("sample", "sample"),
    };
    return apps;
  }
}
