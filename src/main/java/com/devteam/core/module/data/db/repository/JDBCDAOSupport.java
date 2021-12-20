package com.devteam.core.module.data.db.repository;


import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.SqlResultSetExtractor;
import com.devteam.core.module.data.db.SqlSelectView;
import com.devteam.core.module.data.db.SqlUpdate;
import com.devteam.core.module.data.db.query.SqlQuery;
import com.devteam.core.util.dataformat.DataSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import javax.persistence.Table;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class JDBCDAOSupport extends org.springframework.jdbc.core.support.JdbcDaoSupport {
  static final Logger logger = LoggerFactory.getLogger(JDBCDAOSupport.class);

  @Qualifier("transactionManager")
  @Autowired
  private PlatformTransactionManager platformTransactionManager;

  private NamedParameterJdbcTemplate namedJdbcTemplate;

  public JDBCDAOSupport(@Qualifier("datasource") DataSource dataSource) {
    setDataSource(dataSource);
    namedJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
  }

  public int update(ClientInfo client, String sql, Map<String, Object> params) {
    return namedJdbcTemplate.update(sql, params);
  }

  public SqlSelectView query(ClientInfo client, SqlQuery query) {
    Map<String, Object> parameters = query.createQueryParams(client);
    String sql = query.toSql(client);

    if(logger.isDebugEnabled()) {
      StringBuilder b = new StringBuilder("\n");
      b.append("Params: ").append(DataSerializer.JSON.toString(parameters)).append("\n").
        append("SQL: ").append(sql);
      logger.debug(b.toString());
    }
    return namedJdbcTemplate.query(sql, parameters, new SqlResultSetExtractor(query.getSelectFields()));
  }

  public SqlSelectView query(ClientInfo client, String sql, Map<String, Object> parameters) {
    if(logger.isDebugEnabled()) {
      StringBuilder b = new StringBuilder("\n");
      b.append("Params: ").append(DataSerializer.JSON.toString(parameters)).append("\n").
        append("SQL: ").append(sql);
      logger.debug(b.toString());
    }
    return namedJdbcTemplate.query(sql, parameters, new SqlResultSetExtractor());
  }


  public <T> List<T> query(ClientInfo client, SqlQuery query, Class<T> type) {
    Map<String, Object> parameters = query.createQueryParams(client);
    String sql = query.toSql(client);
    StringBuilder b = new StringBuilder("\n");
    if(logger.isDebugEnabled()) {
      b.append("Params: ").append(DataSerializer.JSON.toString(parameters)).append("\n").
        append("SQL: ").append(sql);
      logger.debug(b.toString());
    }
    return namedJdbcTemplate.query(sql, parameters, new BeanPropertyRowMapper<>(type));
  }


  public <T> List<Map<String, Object>> queryForList(ClientInfo client, SqlQuery query) {
    Map<String, Object> parameters = query.createQueryParams(client);
    String sql = query.toSql(client);
    StringBuilder b = new StringBuilder("\n");
    if(logger.isDebugEnabled()) {
      b.append("Params: ").append(DataSerializer.JSON.toString(parameters)).append("\n").
      append("SQL: ").append(sql);
      logger.debug(b.toString());
    }
    return namedJdbcTemplate.queryForList(sql, parameters);
  }

  public void update(ClientInfo client, SqlUpdate<?> sqlUpdate) {
    if(sqlUpdate.getEntities().size() == 0) return;
    String sql = sqlUpdate.toUpdateSql();
    List<SqlUpdate.UpdateEntity> updateEntities = sqlUpdate.getEntities();
    Map<String, Object>[] batchParams = new Map[sqlUpdate.getEntities().size()];
    for(int i = 0; i < updateEntities.size(); i++) {
      SqlUpdate.UpdateEntity sel = updateEntities.get(i);
      batchParams[i] = new HashMap<>();
      for(SqlUpdate.Field field : sel.getFields()) {
        batchParams[i].put(field.getName(), field.getValue());
      }
      batchParams[i].put("id", sel.getId());
    }
    DefaultTransactionDefinition paramTransactionDefinition = new DefaultTransactionDefinition();
    TransactionStatus status = platformTransactionManager.getTransaction(paramTransactionDefinition );
    try {
      int[] ret = namedJdbcTemplate.batchUpdate(sql, batchParams);
      platformTransactionManager.commit(status);
    } catch (Exception e) {
      platformTransactionManager.rollback(status);
      e.printStackTrace();
    }
  }

  public SqlSelectView sqlSelect(String query) {
    JdbcTemplate jdbcTmpl = getJdbcTemplate();
    return jdbcTmpl.query(query, new SqlResultSetExtractor());
  }

  public SqlSelectView sqlSelect(String query, int maxReturn) {
    JdbcTemplate jdbcTmpl = getJdbcTemplate();
    return jdbcTmpl.query(query, new SqlResultSetExtractor());
  }

  public SqlSelectView queryTables() {
    String query = "SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type = 'TABLE'";
    JdbcTemplate jdbcTmpl = getJdbcTemplate();
    return jdbcTmpl.query(query, new SqlResultSetExtractor());
  }

  public int count(Class<?> entity) {
    Table table = entity.getAnnotation(Table.class);
    String tableName = table.name();
    return count(tableName);
  }

  public int count(String tenantId, Class<?> entity) {
    Table table = entity.getAnnotation(Table.class);
    String tableName = table.name();
    return count(tenantId, tableName);
  }

  public int count(String table) {
    JdbcTemplate tmpl = getJdbcTemplate();
    int count = tmpl.queryForObject("SELECT count(*) FROM " + table, Integer.class);
    return count;
  }

  public int deleteAll(String table) {
    JdbcTemplate tmpl = getJdbcTemplate();
    int count = tmpl.update("DELETE FROM " + table);
    return count;
  }

  public int deleteAll(Class<?> entity) {
    JdbcTemplate tmpl = getJdbcTemplate();
    Table table = entity.getAnnotation(Table.class);
    String tableName = table.name();
    int count = tmpl.update("DELETE FROM " + tableName);
    return count;
  }

  public int count(String tenantId, String table) {
    JdbcTemplate tmpl = getJdbcTemplate();
    String sql  = "SELECT count(*) FROM " + table + " WHERE tenantId = '" + tenantId + "'";
    int count = tmpl.queryForObject(sql, Integer.class);
    return count;
  }
}