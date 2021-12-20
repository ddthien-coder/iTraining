package com.devteam.module.company.service.hr.plugin;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.module.company.service.hr.HRService;
import com.devteam.module.company.service.hr.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class MonitorHRServicePlugin extends HRServicePlugin {
  
  public MonitorHRServicePlugin() {
    super("company/hr", HRService.class.getSimpleName(), "monitor");
  }

  @Override
  public void onPreSave(ClientInfo client, Employee employee) {
  }

  @Override
  public void onPostSave(ClientInfo client, Employee employee) {
  }

}
