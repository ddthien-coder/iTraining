package com.devteam.core.module.data.db.repository;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.devteam.core.module.data.db.entity.EditState;
import com.devteam.core.module.data.db.entity.Persistable;
import org.springframework.data.jpa.repository.JpaRepository;



public class RepositoryHelper {
  static public interface CallableEntity<T extends Persistable<Long>> {
    public T call(T entity);
  }
  
  static public <T extends Persistable<Long>> List<T> create(JpaRepository<T, Serializable> repo, List<T> entities, CallableEntity<T> callable) {
    if(entities == null) return entities;
    for(T sel : entities) {
      sel = callable.call(sel);
    }
    if(entities.size() > 0) {
      entities = repo.saveAll(entities);
    }
    return entities;
  }
  
  static public <T extends Persistable<Long>> List<T> persist(JpaRepository<T, Serializable> repo, List<T> entities, CallableEntity<T> callable) {
    if(entities == null) return entities;
    List<T> toDelete = new ArrayList<>();
    List<T> toPersist = new ArrayList<>();
    for(T sel : entities) {
      sel = callable.call(sel);
      if(sel.getEditState() == EditState.DELETED) {
        toDelete.add(sel);
      } else {
        toPersist.add(sel);
      }
    }
    if(toDelete.size() > 0) {
      repo.deleteAll(toDelete);
    }
    if(toPersist.size() > 0) {
      toPersist = repo.saveAll(toPersist);
    }
    return toPersist;
  }
}
