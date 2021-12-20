package com.devteam.core.module.data.db.entity;

import java.util.HashMap;
import java.util.List;

public class EntityIdMap<T extends PersistableEntity<Long>> extends HashMap<Long, T> {
  private static final long serialVersionUID = 1L;
 
  public EntityIdMap() { }

  public EntityIdMap(List<T> entities) { 
    for(T sel : entities) add(sel);
  }
  
  public void add(T entity) {
    put(entity.getId(), entity);
  }
}
