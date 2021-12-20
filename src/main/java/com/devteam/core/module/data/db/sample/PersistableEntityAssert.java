package com.devteam.core.module.data.db.sample;


import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.ChangeStorageStateRequest;
import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.devteam.core.module.data.db.entity.StorageState;
import com.devteam.core.module.data.db.query.SqlQueryParams;
import com.devteam.core.util.dataformat.DataSerializer;
import com.devteam.core.util.ds.AssertTool;
import org.junit.jupiter.api.Assertions;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

public class PersistableEntityAssert<T extends PersistableEntity<Long>> extends AssertTool {
  public interface EntityCallback<Entity> {
    public void call(Entity orig, Entity entity);
  }
  
  public interface EntityCallbackDep<Entity> {
    public void call(Entity entity);
  }
  
  public interface SearchCallback<Entity> {
    public void call(Entity entity, List<?> list);
  }

  public interface ResultCallback<Entity, T> {
    public void call(Entity entity, T result);
  }
  
  abstract public class EntityServiceMethods {
    
    public T load() {
      fail("method is not implemented");
      return null;
    }
    
    public List<T> loadList() {
      fail("method is not implemented");
      return null;
    }
    
    public T save(T clone) {
      fail("method is not implemented");
      return null;
    }
    
    public T customUpdate(T modifiedEntity, EntityCallbackDep<T> callback) {
      assertEquals(entity.getId(), modifiedEntity.getId(), "Entities are not the same id");
      T savedEntity = save(modifiedEntity);
      callback.call(savedEntity);
      return savedEntity;
    }
    
    public  List<?> search(SqlQueryParams params) {
      fail("method is not implemented");
      return null;
    }
    
    public List<T> saveList(List<T> clones) {
      fail("method is not implemented");
      return null;
    }
    
    public List<?> searchEntity() {
      return search(new SqlQueryParams(entity.identify()));
    }
    
    public boolean archive() {
      fail("Method is not implemented");
      return false;
    }
  }
  
  protected ClientInfo client;
  protected T                                 entity;
  protected EntityServiceMethods              methods;
  
  
  protected PersistableEntityAssert() {
  }
  
  protected PersistableEntityAssert(ClientInfo client, T entity) {
    init(client, entity);
  }
  
  protected void init(ClientInfo client, T entity) {
    this.client  = client;
    this.entity = entity;
  }
  
  protected SqlQueryParams createSearchQuery(String exp) {
    SqlQueryParams params = new SqlQueryParams().addSearchTerm("search", exp);
    return params;
  }
  
  public ChangeStorageStateRequest createArchivedStorageRequest(PersistableEntity<Long> entity) {
    ChangeStorageStateRequest change = new ChangeStorageStateRequest(StorageState.ARCHIVED);
    change.withEntityId(entity.getId());
    return change;
  }
  
  @SuppressWarnings("unchecked")
  public <I extends PersistableEntityAssert<T>> I assertLoad(EntityCallback<T> callback) {
    callback.call(entity, methods.load());
    return (I)this;
  }
  
  @SuppressWarnings("unchecked")
  public <I extends PersistableEntityAssert<T>> I assertEntity(EntityCallback<T> callback) {
    T clone = DataSerializer.JSON.clone(entity);
    callback.call(entity, clone);
    return (I)this;
  }
  
  @SuppressWarnings("unchecked")
  public <I extends PersistableEntityAssert<T>> I assertEntityCreated() {
    T loadedEntity = methods.load();
    assertNotNull(loadedEntity);
    assertNotNull(loadedEntity.getId());
    return (I)this;
  }

  @SuppressWarnings("unchecked")
  public <I extends PersistableEntityAssert<T>> I assertEntitySearch() {
    List<?> entities = methods.searchEntity();
    assertEquals(1, entities.size());
    return (I)this;
  }
  public <I extends PersistableEntityAssert<T>> I assertEntitySearch(SearchCallback<T> callback) {
    List<?> entities = methods.searchEntity();
    assertEquals(1, entities.size());
    callback.call(entity, entities);
    return (I)this;
  }
  
  @Transactional
  @SuppressWarnings("unchecked")
  public <I extends PersistableEntityAssert<T>> I assertEntityUpdate() {
    try {
      Date modifiedTime = entity.getModifiedTime();
      Thread.sleep(5);
      T clone = DataSerializer.JSON.clone(entity);
      T updated = methods.save(clone);
      assertTrue(modifiedTime.getTime() < updated.getModifiedTime().getTime());
    } catch (Exception e) {
      fail(e);
    }
    return (I)this;
  }
  
  @Transactional
  @SuppressWarnings("unchecked")
  public <I extends PersistableEntityAssert<T>> I assertEntityArchive() {
    methods.archive();
    T loadedEntity = methods.load();
    assertEquals(StorageState.ARCHIVED, loadedEntity.getStorageState());
    return (I)this;
  }
  
  @SuppressWarnings("unchecked")
  public <I extends PersistableEntityAssert<T>> I assertLoadList(int expectSize) {
    List<T> entities = methods.loadList();
    assertEquals(expectSize, entities.size());
    return (I)this;
  }
  
  @Transactional
  @SuppressWarnings("unchecked")
  public <I extends PersistableEntityAssert<T>> I assertSaveList(List<T> entities) {
    List<T> origEntities = methods.loadList();
    int difference = entities.size() - origEntities.size(); 
    List<T> savedList = methods.saveList(entities);
    Assertions.assertEquals(difference, savedList.size() - origEntities.size());
    return (I)this;
  }
  
  @Transactional
  @SuppressWarnings("unchecked")
  public <I extends PersistableEntityAssert<T>> I assertSave(T entity, EntityCallbackDep<T> callback) {
    methods.customUpdate(entity, callback);
    return (I)this;
  }
  
  @SuppressWarnings("unchecked")
  public <I extends PersistableEntityAssert<T>> I assertSearch(SqlQueryParams params, EntityCallbackDep<List<?>> callback) {
    List<?> results = methods.search(params);
    callback.call(results);
    return (I)this;
  }
}
