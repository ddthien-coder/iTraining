package com.devteam.server.demo;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.module.company.core.entity.Company;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class DemoService {

  @Getter
  @Autowired
  private ApplicationContext context;

  void importPluginSampleByModule(ClientInfo client, Company company, ImportModule module)throws Exception {
    for(ImportModule.ImportPlugin plugin : module.plugins) {
      runImport(context, client, company, module.getName(), plugin.getName());
    }
  }

  public void importAllPluginSample(ClientInfo client, Company company) throws Exception {
    importPluginSampleByModule(client, company, ImportModule.COMPANY);
    importPluginSampleByModule(client, company, ImportModule.ACCOUNT);
  }

  public void importPluginSample(ClientInfo client, Company company, String module, String plugin) throws Exception {
    runImport(context, client, company, module, plugin);
  }

  protected void runImport(ApplicationContext context, ClientInfo client, Company company, String module, String plugin) throws Exception {
    log.info("Import the demo data for module {}, pluging {}", module, plugin);
    log.info("Import the demo data for module {}, pluging { done!!!}", module, plugin);
  }
}
