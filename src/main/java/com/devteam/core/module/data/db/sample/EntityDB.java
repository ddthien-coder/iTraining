package com.devteam.core.module.data.db.sample;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;

import com.devteam.core.module.data.db.JPAService;
import org.springframework.context.ApplicationContext;



public class EntityDB {
  final static public String DEFAULT_COMPANY = "demo";
  
  static EntityDB instance = null ;
  
  private ApplicationContext    context;
  Map<String, Object>      dataMap    = new HashMap<>();
  Map<String, CompanyDataMap> allCompanyDataMap = new HashMap<>();
 
  private EntityDB(ApplicationContext context) {
    this.context = context;
  }
  
  public EntityManager getEntityManager() {
    return context.getBean(JPAService.class).getEntityManager();
  }

  public <T> T getData(Class<T> type) { 
    T data = (T) dataMap.get(type.getName()); 
    if(data == null) {
      data = context.getAutowireCapableBeanFactory().createBean(type);
      dataMap.put(type.getName(), data);
    }
    return data ;
  }

  public <T> T getCompanyData(Class<T> type) { 
    return getData(DEFAULT_COMPANY, type);
  }

  public <T> T getData(String company, Class<T> type) { 
    CompanyDataMap companyDataMap = allCompanyDataMap.get(company);
    if(companyDataMap == null) {
      companyDataMap = new CompanyDataMap();
      allCompanyDataMap.put(company, companyDataMap);
    }
    return companyDataMap.getData(context, type) ;
  }
  
  static public void initDataDB(ApplicationContext context) {
    instance = new EntityDB(context);
  }

  static public void clearDataDB() {
    instance = null;
  }
  
  static public EntityDB getInstance() { return instance ; }
  
  static public class CompanyDataMap {
    Map<String, Object> dataMap = new HashMap<>();

    public <T> T getData(ApplicationContext context, Class<T> type) { 
      T data = (T) dataMap.get(type.getName()); 
      if(data == null) {
        data = context.getAutowireCapableBeanFactory().createBean(type);
        dataMap.put(type.getName(), data);
      }
      return data ;
    }
  }
}
