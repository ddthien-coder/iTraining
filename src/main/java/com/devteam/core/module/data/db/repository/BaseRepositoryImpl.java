package com.devteam.core.module.data.db.repository;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.OptimisticLockException;
import javax.persistence.Query;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.ICompany;
import com.devteam.core.module.data.db.entity.ICompanyEntity;
import com.devteam.core.module.data.db.entity.Persistable;
import com.devteam.core.util.ds.Collections;
import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

@Transactional(readOnly = true)
@Slf4j
public class BaseRepositoryImpl<T extends Persistable<ID>, ID
  extends Serializable> extends SimpleJpaRepository<T, ID>  
  implements BaseRepository<T, ID> {
  
  private EntityManager              entityManager;
  private String                     entityName;

  public BaseRepositoryImpl(Class<T> domainClass, EntityManager em) {
    super(domainClass, em);
    entityManager = em;
    entityName = JpaEntityInformationSupport.getEntityInformation(domainClass, em).getEntityName();
  }

  @Override
  @SuppressWarnings("unchecked")
  public T getByCode(ClientInfo client, String code) {
    try {
      String[][] fieldValues = { {"code", code} };
      return (T) toQuery(client, fieldValues).getSingleResult();
    } catch (NoResultException e) {
      return null;
    }
  }

  public T reload(T entity) {
    entity = getById(entity.getId());
    return entity;
  }
  
  public List<T> reload(List<T> entity) {
    if(Collections.isEmpty(entity)) return entity;
    List<T> holder = new ArrayList<T>();
    for(T sel : entity) {
      sel = getById(sel.getId());
      holder.add(sel);
    }
    return holder ;
  }

  @Override
  @SuppressWarnings("unchecked")
  public T getByCode(ClientInfo client, ICompany company, String code) {
    try {
      Object[][] fieldValues = {{"companyId", company.getId()}, {"code", code} };
      return (T) toQuery(client, fieldValues).getSingleResult();
    } catch (NoResultException e) {
      return null;
    }
  }
  
  @SuppressWarnings("unchecked")
  public List<Long> findAvailableIds(ClientInfo client) {
    String jpql  = "SELECT id FROM " + entityName ;
    Query query = entityManager.createQuery(jpql);
    return query.getResultList();
  }

  public T save(ClientInfo client, T entity) {
    try {
      entity.set(client);
      return super.save(entity);
    } catch(RuntimeException error) {
      throw handleError(error);
    }
  }

  public T save(ClientInfo client, ICompany company, T entity) {
    try {
      ICompanyEntity companyEntity = (ICompanyEntity) entity;
      companyEntity.set(client, company.getId());
      return super.save(entity);
    } catch(RuntimeException error) {
      throw handleError(error);
    }
  }

  public List<T> saveAll(ClientInfo client, List<T> entities) {
    try {
      for(T entity : entities) entity.set(client);
      return super.saveAll(entities);
    } catch(RuntimeException error) {
      throw handleError(error);
    }
  }
  
  public List<T> saveAll(ClientInfo client, ICompany company, List<T> entities) {
    try {
      for(T entity : entities) {
        ICompanyEntity companyEntity = (ICompanyEntity) entity;
        companyEntity.set(client, company.getId());
      }
      return super.saveAll(entities);
    } catch(RuntimeException error) {
      throw handleError(error);
    }
  }

  Query toQuery(ClientInfo client, Object[][] fieldValues) {
    if(fieldValues.length == 0) {
      throw new IllegalArgumentException("Expect at least one parameter for the filter");
    }
    String jpql = "FROM " + entityName + " WHERE " + toClauses(client, fieldValues) ;
    if(log.isDebugEnabled()) log.debug("Query: {}", jpql);
    Query query = entityManager.createQuery(jpql);
    setQueryParams(query, fieldValues);
    return query;
  }
  
  Query toQuery(ClientInfo client, String jpql, Object[][] keyValues) {
    Query query = entityManager.createQuery(jpql);
    setQueryParams(query, keyValues);
    return query;
  }

  Query toQuery(ClientInfo client, String jpql, Map<String, Object> params) {
    Query query = entityManager.createQuery(jpql);
    setQueryParams(query, params);
    return query;
  }
  
  String toClauses(ClientInfo client, Object[][] keyValues) {
    StringBuilder b = new StringBuilder() ;
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
  
  void setQueryParams(Query query, Object[][] keyValues) {
    for(Object[] keyValue : keyValues) {
      String key = (String) keyValue[0];
      Object value =  keyValue[1];
      query.setParameter(key, value);
    }
  }

  void setQueryParams(Query query, Map<String, Object> params) {
    for(Map.Entry<String, Object> entry : params.entrySet()) {
      query.setParameter(entry.getKey(), entry.getValue());
    }
  }
  
  RuntimeException handleError(RuntimeException error)  {
    if(error instanceof OptimisticLockException) {
      return new RuntimeError(ErrorType.EntityModified , "The entity has been modified by another", error);
    }
    return error;
  }
}