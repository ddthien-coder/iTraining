/**
 * 
 */
package com.devteam.core.module.security;

import java.util.ArrayList;
import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.DBServicePlugin;
import com.devteam.core.module.security.entity.App;
import com.devteam.core.module.security.entity.AppPermission;
import com.devteam.core.module.security.plugin.InitSecurityDBPlugin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(value = DBServicePlugin.CORE_SECURITY)
public class SecurityDBServicePlugin extends DBServicePlugin {
  @Autowired(required = false) 
  List<InitSecurityDBPlugin> initDbPlugins = new ArrayList<>();
  
  @Autowired
  SecurityService service;
  
  public void initDb(ClientInfo client, ApplicationContext context) throws Exception {
    for(InitSecurityDBPlugin sel : initDbPlugins) {
      App[] apps = sel.getAvailableApps(client, context);
      for (App app : apps) {
        service.saveApp(client, app);
      }
    }
  }

  public <T> void initCompanyDb(ClientInfo client, T companyCtx,  ApplicationContext context) throws Exception {
//    for(InitSecurityDBPlugin sel : initDbPlugins) {
//      saveAppPermissions(client, sel.getInitAppPermissions(client, companyCtx, context));
//    }
  }

  public <T> void createSammpleData(ClientInfo client, T companyCtx, ApplicationContext context) throws Exception {
    for(InitSecurityDBPlugin sel : initDbPlugins) {
      saveAppPermissions(client, sel.getSampleAppPermissions(client, companyCtx, context));
    }
  }

  void saveAppPermissions(ClientInfo client, List<AppPermission> permissions) throws Exception {
    if(permissions == null) return;
    for (AppPermission permision : permissions) {
      service.saveAppPermisson(client, permision);
    }
  }
}
