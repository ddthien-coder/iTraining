package com.devteam.server.plugin;

import java.util.ArrayList;
import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.security.SecurityService;
import com.devteam.core.module.security.entity.App;
import com.devteam.core.module.security.entity.AppPermission;
import com.devteam.core.module.security.entity.Capability;
import com.devteam.core.module.security.plugin.InitSecurityDBPlugin;
import com.devteam.module.company.core.entity.Company;
import com.devteam.module.company.service.hr.HRService;
import com.devteam.module.company.service.hr.entity.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;


@Component
public class AppInitSecurityDBPlugin extends InitSecurityDBPlugin {

  @Autowired
  SecurityService service;

  @Autowired
  HRService hrService;

  public AppInitSecurityDBPlugin() {
    super("App");
  }

  public App[] getAvailableApps(ClientInfo client, ApplicationContext context) throws Exception {
    return createApps();
  }

  public <T> List<AppPermission> getInitAppPermissions(ClientInfo client, T companyCtx, ApplicationContext context) throws Exception {
    Company company = (Company) companyCtx;
    String adminUser  = company.getAdminAccountLoginId();
    if(adminUser == null) adminUser = "admin";
    App[] apps = createApps();
    List<AppPermission> permissions = new ArrayList<>();
    
    for(App selApp : apps) {
      App app = service.getApp(client, selApp.getModule(), selApp.getName());
      AppPermission permission = 
          new AppPermission(company.getId(), adminUser).withCapability(Capability.Admin).withApp(app);
      if(!adminUser.equals("admin")) {
        permission.withCapability(Capability.Moderator);
      }
      permissions.add(permission);
    }
    return permissions;
  }

  public <T> List<AppPermission> getSampleAppPermissions(ClientInfo client, T companyCtx,  ApplicationContext context) throws Exception {
    Company company = (Company) companyCtx;
    Employee thien = hrService.getEmployee(client, company, "thien");
    Employee admin  = hrService.getEmployee(client, company, "admin");

    if(thien != null) {
      List<AppPermission> thienExistPermissions = service.findAppPermissions(client, company.getId(), thien.getLoginId());
      service.deletePermissions(client, thienExistPermissions);
    }
    
    if(admin != null) {
      List<AppPermission> lienExistPermissions = service.findAppPermissions(client, company.getId(), admin.getLoginId());
      service.deletePermissions(client, lienExistPermissions);
    }

    
    List<AppPermission> permissions = new ArrayList<>();
    App[] apps = createApps();
    for(App selApp : apps) {
      App app = service.getApp(client, selApp.getModule(), selApp.getName());
      if(thien != null) {
        AppPermission permission = 
            new AppPermission(company.getId(), thien.getLoginId()).withCapability(Capability.Moderator).withApp(app);
        permissions.add(permission);
      }
      if(admin != null) {
        AppPermission permission = 
            new AppPermission(company.getId(), admin.getLoginId()).withCapability(Capability.Write).withApp(app);
        permissions.add(permission);
      }
    }
    return permissions;
  }
  
  private App[] createApps() {
    App[] apps = {
            new App("user", "my-space").withRequiredCapability(Capability.Read),
            new App("admin", "admin").withRequiredCapability(Capability.Read) ,
            new App("company", "company").withRequiredCapability(Capability.Read),
            new App("system", "system").withRequiredCapability(Capability.Read),
            new App("sample", "sample").withRequiredCapability(Capability.Admin)
    };
    return apps;
  }
}
