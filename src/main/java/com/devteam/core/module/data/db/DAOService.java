package com.devteam.core.module.data.db;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.Table;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.query.SqlQuery;
import com.devteam.core.module.data.db.query.SqlQueryParams;
import com.devteam.core.module.data.db.repository.JDBCDAOSupport;
import org.springframework.beans.factory.annotation.Autowired;

public class DAOService {
  @Autowired
  protected JDBCDAOSupport daoSupport;
  
  public DAOService() {}
  
  public <T> List<T> query(ClientInfo client, SqlQuery query, Class<T> type) {
    return daoSupport.query(client, query, type); 
  }
  
  public <T> List<T> query(ClientInfo client, SqlQuery query, SqlQueryParams params, Class<T> type) {
    query.mergeValue(params);
    return daoSupport.query(client, query, type); 
  }

  public SqlSelectView query(ClientInfo client, SqlQuery query) { 
    return daoSupport.query(client, query); 
  }

  public SqlSelectView query(ClientInfo client, SqlQuery query, SqlQueryParams params) { 
    query.mergeValue(params);
    return daoSupport.query(client, query); 
  }
  
  public <T> List<Map<String, Object>> queryForList(ClientInfo client, SqlQuery query) { 
    return daoSupport.queryForList(client, query); 
  }
  
  public int update(ClientInfo client, String sql, Map<String, Object> params) { 
    return daoSupport.update(client, sql, params);
  }
  
  protected int execute(String sql, Object[] args) {
    return daoSupport.getJdbcTemplate().update(sql, args) ;
  }
  
  public int count(String table) { return daoSupport.count(table); }
  
  public int count(Class<?> entity) {
    Table table = entity.getAnnotation(Table.class);
    String tableName = table.name();
    return daoSupport.count(tableName);
  }
  
  public int count(String tenantId, Class<?> entity) {
    Table table = entity.getAnnotation(Table.class);
    String tableName = table.name();
    return daoSupport.count(tenantId, tableName); 
  }
  
  public void assertEmptyTable(Class<?> entity) {
    if(count(entity) > 0) {
      throw new RuntimeException("Table for the entity " + entity.getSimpleName() + " is not empty");
    }
  }
  
  public void assertEmptyTable(ClientInfo client, Class<?> entity) {
    if(count(client.getTenantId(), entity) > 0) {
      throw new RuntimeException("Table for the entity " + entity.getSimpleName() + " and tenant " + client.getTenantId() + " is not empty");
    }
  }

  public <T> List<T> fieldValueOf(List<? extends Map<String, Object>> recordList, String field, Class<T> type) {
    List<T> holder = new ArrayList<T>() ;
    for(Map<String, Object> record : recordList) {
      Object value = record.get(field) ;
      holder.add((T)value);
    }
    return holder;
  }
}
