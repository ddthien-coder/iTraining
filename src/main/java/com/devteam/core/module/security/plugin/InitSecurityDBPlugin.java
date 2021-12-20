package com.devteam.core.module.security.plugin;

import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.plugin.ServicePlugin;
import com.devteam.core.module.security.entity.App;
import com.devteam.core.module.security.entity.AppPermission;
import org.springframework.context.ApplicationContext;


abstract public class InitSecurityDBPlugin extends ServicePlugin {
  
  protected InitSecurityDBPlugin(String type) {
    super("security", "SecurityService", type);
  }

  abstract public App[] getAvailableApps(ClientInfo client, ApplicationContext context) throws Exception ;

  abstract public <T> List<AppPermission> getInitAppPermissions(ClientInfo client, T companyCtx, ApplicationContext context) throws Exception ;

  public <T> List<AppPermission> getSampleAppPermissions(ClientInfo client, T companyCtx,  ApplicationContext context) throws Exception {
    return null;
  }
}
