package com.devteam.core.module.data.db;

import java.util.List;

import javax.annotation.PostConstruct;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.query.SearchFilter;
import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;


@Service
public class DBService {
  @Autowired
  private ApplicationContext context;
  
  @Autowired(required = false)
  private List<DBServicePlugin>   plugins;

  @Value("${hibernate.dialect:#{null}}")
  private String dialect;
  
  @PostConstruct
  public void onInit() {
    SearchFilter.supportILike(dialect);
  }

  public <T> void initDb(ClientInfo client, boolean initSampleData) throws Exception {
    if(plugins == null) return;
    for(DBServicePlugin plugin : plugins) {
      initDb(client, plugin);
    }
    
    if(initSampleData) {
      for(DBServicePlugin plugin : plugins) {
        createSampleData(client, plugin);
      }
    }
    
    for(DBServicePlugin plugin : plugins) {
      Logger logger = plugin.getLogger();
      logger.info("postInitDb(...)");
      plugin.postInitDb(client, this, context, initSampleData);
    }
  }

  public <T> void initCompanyDb(ClientInfo client, T companyCtx, boolean initSampleData) {
    if(plugins == null) return;
    try {
      for(DBServicePlugin plugin : plugins) {
        initCompanyDb(client, companyCtx, plugin);
      }
      if(initSampleData) {
        for(DBServicePlugin plugin : plugins) {
          initCompanySample(client, companyCtx, plugin);
        }
      }
    } catch(Throwable error) {
      error.printStackTrace();
      throw new RuntimeError(ErrorType.Unknown, "Cannot create company database", error) ;
    }
  }
  
  public void initDb(ClientInfo client, DBServicePlugin plugin) throws Exception {
    Logger log = plugin.getLogger();
    log.info("initDb()");
    plugin.initDb(client, context);
  }

  public void createSampleData(ClientInfo client, DBServicePlugin plugin) throws Exception {
    Logger logger = plugin.getLogger();
    logger.info("createSampleData(...)");
    plugin.createSammpleData(client, context);
  }

  public <T> void initCompanyDb(ClientInfo client, T companyCtx, DBServicePlugin plugin) throws Exception {
    Logger logger = plugin.getLogger();
    logger.info("initCompanyDb()");
    plugin.initCompanyDb(client, companyCtx, context);
  }

  public <T> void initCompanySample(ClientInfo client, T companyCtx, DBServicePlugin plugin) throws Exception {
    Logger logger = plugin.getLogger();
    logger.info("createCompanySampleData(...)");
    plugin.createSammpleData(client, companyCtx, context);
  }
}
