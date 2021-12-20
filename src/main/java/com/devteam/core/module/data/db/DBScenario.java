package com.devteam.core.module.data.db;

import java.util.ArrayList;
import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;


public class DBScenario {
  private static final Logger logger = LoggerFactory.getLogger(DBScenario.class);

  private ApplicationContext context;

  public DBScenario(ApplicationContext context) {
    this.context = context;
  }

  private List<AbstractDBModuleScenario> modules = new ArrayList<AbstractDBModuleScenario>();

  public DBScenario add(AbstractDBModuleScenario moduleScenario) {
    modules.add(moduleScenario);
    return this;
  }

  public <T extends AbstractDBModuleScenario> DBScenario add(Class<T> type) {
    modules.add(createBean(type));
    return this;
  }

  public void initialize(ClientInfo client) throws Exception {
    for(AbstractDBModuleScenario module : modules) {
      initialize(client, module);
    }
  }
  

  public void initialize(ClientInfo client, AbstractDBModuleScenario module) throws Exception {
    String className = module.getClass().getSimpleName();
    logger.info("Load {} data", className);
    long start = System.currentTimeMillis();
    module.initializeWithTransaction(client, context, this);
    logger.info("Load {} data in  {}", className, (System.currentTimeMillis() - start) + "ms");
  }

  public <T> T createBean(Class<T> type) {
    return context.getAutowireCapableBeanFactory().createBean(type);
  } 
}
