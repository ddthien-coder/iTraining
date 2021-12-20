package com.devteam.module.company.service.hr;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.DBScenario;
import com.devteam.core.module.data.db.DBServicePlugin;
import com.devteam.module.company.service.hr.data.DBModuleScenario;
import com.devteam.module.company.service.hr.plugin.MonitorHRServicePlugin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;


@Component
@Order(value = DBServicePlugin.COMPANY_HR)
public class HRDBServicePlugin extends DBServicePlugin {
  @Autowired
  private MonitorHRServicePlugin monitorPlugin;

  public void initDb(ClientInfo client, ApplicationContext context) throws Exception {
    monitorPlugin.createPluginInfo(client);
  }
  
  @Override
  public void createSammpleData(ClientInfo client,  ApplicationContext context) throws Exception {
    new DBScenario(context).add(DBModuleScenario.class).initialize(client);
  }
}
