package com.devteam.core.module.data.db.repository.tenant;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;
import com.devteam.core.util.text.DateUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.transaction.annotation.Transactional;


@Transactional(readOnly = true)
public class TenantRepositoryImpl<T extends PersistableEntity<ID>, ID
  extends Serializable> extends SimpleJpaRepository<T, ID>  
  implements TenantRepository<T, ID> {
  
  private static final Logger logger = LoggerFactory.getLogger(TenantRepositoryImpl.class);
  
  private EntityManager              entityManager;
  private String                     entityName;

  public TenantRepositoryImpl(Class<T> domainClass, EntityManager em) {
    super(domainClass, em);
    entityManager = em;
    entityName = JpaEntityInformationSupport.getEntityInformation(domainClass, em).getEntityName();
  }

  @Override
  public T getOne(ClientInfo client, Object[][] keyValues) {
    String tenantId = client == null ? null : client.getTenantId();
    try {
      return (T) toQuery(tenantId, keyValues).getSingleResult();
    } catch (NoResultException e) {
      return null;
    }
  }
  
  @Override
  public T getOne(ClientInfo client, String filter, Object[][] params) {
    String tenantId = client == null ? null : client.getTenantId();
    try {
      return (T) toQuery(tenantId, filter, params).getSingleResult();
    } catch (NoResultException e) {
      return null;
    }
  }
  
  @Override
  public List<T> getAll(ClientInfo client) {
    String tenantId = client == null ? null : client.getTenantId();
    String jpql = "SELECT e FROM " + entityName + " e";
    if(tenantId != null) jpql += " WHERE tenantId = '" + tenantId + "'";
    Query query = entityManager.createQuery(jpql);
    return query.getResultList();
  }
  
  @Override
  public Page<T> findAll(ClientInfo client, Pageable pageable) {
    String tenantId = client.getTenantId();
    return findAll((root, query, criteria) -> criteria.equal(root.get("tenantId"), tenantId), pageable) ;
  }
  
  @Override
  public List<T> find(ClientInfo client, Object[][] keyValues) {
    String tenantId = client == null ? null : client.getTenantId();
    return toQuery(tenantId, keyValues).getResultList();
  }
  
  @Override
  public List<T> find(ClientInfo client, String filter, Object[][] params) {
    String tenantId = client == null ? null : client.getTenantId();
    return toQuery(tenantId, filter, params).getResultList();
  }
  
  @Override
  public <R> List<R> query(ClientInfo client, String jpql, Object[][] keyValues) {
    String tenantId = client == null ? null : client.getTenantId();
    if(tenantId != null) {
      String tenantFilter = "(tenantId = :tenantId)";
      if(jpql.indexOf("WHERE") > 0) {
        jpql = jpql.replace("WHERE", "WHERE(") + ") AND " + tenantFilter;
      } else if(jpql.indexOf("where") > 0) {
        jpql = jpql.replace("where", "WHERE(") + ") AND " + tenantFilter;
      } else {
        jpql = jpql + " WHERE" + tenantFilter;
      }
    }
    logger.debug("query: {}", jpql);
    Query query = entityManager.createQuery(jpql);
    setQueryParams(query, tenantId, keyValues);
    return query.getResultList();
  }
  
  @Override
  public <R> List<R> customTenantQuery(ClientInfo client, String jpql, Object[][] keyValues) {
    String tenantId = client == null ? null : client.getTenantId();
    if(tenantId == null) {
      jpql = jpql.replace("{{.*}}", "");
    } else {
      jpql = jpql.replace("{{", "").replace("}}", "");
    }
    logger.debug("custom tenant query: {}", jpql);
    Query query = entityManager.createQuery(jpql);
    setQueryParams(query, tenantId, keyValues);
    return query.getResultList();
  }
  
  @Override
  @Transactional
  public T save(ClientInfo client, T entity) {
    return save(client, entity, false);
  }
  
  @Override
  @Transactional
  public T save(ClientInfo client, T entity, boolean checkModified) {
    if(checkModified && !entity.isNew()) {
      T oldEntity = getById(entity.getId());
      long diff = Math.abs(oldEntity.getModifiedTime().getTime() - entity.getModifiedTime().getTime())/1000;
      if(diff != 0) {
        String mesg = 
            entity.getClass().getSimpleName() + " " + entity.getId() + " has been modified by " +
            oldEntity.getModifiedBy() + " at " + DateUtil.asCompactDateTime(oldEntity.getModifiedTime());
        throw new RuntimeError(ErrorType.EntityModified, mesg);
      }
    }
    entity.set(client);
    return super.save(entity);
  }
  
  @Override
  @Transactional
  public List<T> saveAll(ClientInfo client, List<T> entities) {
    Date time = new Date();
    for(T sel : entities) sel.set(client, time);
    return super.saveAll(entities);
  }
  
  @Override
  @Transactional
  public List<T> saveAll(ClientInfo client, List<T> entities, boolean checkModified) {
//    Date time = new Date();
//    for(T sel : entities) {
//      //TODO: check modified
//      sel.set(client, time);
//    }
//    return super.saveAll(entities);
    throw new RuntimeException("TODO: implement this method");
  }
  
  @Override
  @Transactional
  public void deleteAll(ClientInfo client) {
    if(client == null) {
      throw new IllegalArgumentException("client info cannot be null");
    }
    List<Long> ids = getAvailableIds(client);
    for(Long id : ids) deleteById((ID) id);
  }
  
  public List<Long> getAvailableIds(ClientInfo client) {
    String jpql  = "SELECT id FROM " + entityName + " WHERE tenantId = :tenantId";
    Object[][] params = {{"tenantId", client.getTenantId()}};
    Query query = entityManager.createQuery(jpql);
    setQueryParams(query, client.getTenantId(), params);
    return query.getResultList();
  }
  
  @Override
  @Transactional
  public int delete(ClientInfo client, Object[][] keyValues) {
    String tenantId = client == null ? null : client.getTenantId();
    String jpql  = "DELETE FROM " + entityName + " WHERE " + toClauses(tenantId, keyValues) ;
    Query query = entityManager.createQuery(jpql);
    setQueryParams(query, client.getTenantId(), keyValues);
    return query.executeUpdate();
  }
  
  @Override
  @Transactional
  public int delete(ClientInfo client, String filter, Object[][] keyValues) {
    String tenantId = client == null ? null : client.getTenantId();
    String jpql  = "DELETE FROM " + entityName + " WHERE " + toClauses(tenantId, filter, keyValues) ;
    Query query = entityManager.createQuery(jpql);
    setQueryParams(query, tenantId, keyValues);
    return query.executeUpdate();
  }
  
  @Override
  @Transactional
  public void delete(ClientInfo client, T entity) { delete(entity); }
  
  @Override
  @Transactional
  public void deleteAll(ClientInfo client, List<T> entities) { deleteAll(entities); }
  
  @Override
  public long count(ClientInfo client, Object[][] keyValues) {
    String tenantId = client == null ? null : client.getTenantId();
    String jpql  = "SELECT COUNT(e) FROM " + entityName + " e WHERE " + toClauses(tenantId, keyValues) ;
    TypedQuery<Long> query = entityManager.createQuery(jpql, Long.class);
    setQueryParams(query, tenantId, keyValues);
    long count = query.getSingleResult();
    return count;
  }
  
  @Override
  public long count(ClientInfo client, String filter, Object[][] keyValues) {
    String tenantId = client == null ? null : client.getTenantId();
    String jpql  = "SELECT COUNT(e) FROM " + entityName + " e WHERE " + toClauses(tenantId, filter, keyValues) ;
    TypedQuery<Long> query = entityManager.createQuery(jpql, Long.class);
    setQueryParams(query, tenantId, keyValues);
    long count = query.getSingleResult();
    return count;
  }
  
  Query toQuery(String tenantId, String filter, Object[][] keyValues) {
    String jpql = "FROM " + entityName + " WHERE " + toClauses(tenantId, filter, keyValues);
    Query query = entityManager.createQuery(jpql);
    setQueryParams(query, tenantId, keyValues);
    return query;
  }
  
  String toClauses(String tenantId, String filter, Object[][] keyValues) {
    String jpql = "";
    if(tenantId != null) jpql += "(tenantId = :tenantId) AND ";
    jpql += "(" + filter + ")";
    return jpql;
  }
  
  Query toQuery(String tenantId, Object[][] keyValues) {
    if(keyValues.length == 0) {
      throw new IllegalArgumentException("Expect at least one parameter for the filter");
    }
    String jpql = "FROM " + entityName + " WHERE " + toClauses(tenantId, keyValues) ;
    if(logger.isDebugEnabled()) {
      logger.debug("Query: {}", jpql);
    }
    Query query = entityManager.createQuery(jpql);
    setQueryParams(query, tenantId, keyValues);
    return query;
  }
  
  String toClauses(String tenantId, Object[][] keyValues) {
    StringBuilder b = new StringBuilder() ;
    if(tenantId != null) b.append("(tenantId = :tenantId) AND ");
    b.append("(");
    boolean first = true;
    for(Object[] keyValue : keyValues) {
      if(!first) b.append(" AND ");
      String key = (String) keyValue[0];
      b.append(key).append(" = ").append(":").append(key);
      first = false;
    }
    b.append(")");
    return b.toString();
  }
  
  void setQueryParams(Query query, String tenantId, Object[][] keyValues) {
    if(tenantId != null) query.setParameter("tenantId", tenantId);
    for(Object[] keyValue : keyValues) {
      String key = (String) keyValue[0];
      Object value =  keyValue[1];
      query.setParameter(key, value);
    }
  }
}