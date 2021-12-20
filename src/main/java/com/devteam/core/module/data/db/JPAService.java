package com.devteam.core.module.data.db;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.metamodel.EntityType;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.Persistable;
import org.springframework.stereotype.Service;

import lombok.Getter;

@Service
public class JPAService {
  @Getter
  @PersistenceContext(unitName = "entityManagerFactory")
  private EntityManager entityManager;
  
  public List<EntityInfo> getEntityInfos(ClientInfo client) {
    Set<EntityType<?>> set = entityManager.getMetamodel().getEntities();
    List<EntityInfo> holder = new ArrayList<>();
    for(EntityType<?> sel : set) {
      holder.add(new EntityInfo(sel));
    }
    return holder;
  }

  public <T extends Persistable<?>> T refresh(T entity) {
    if(!entity.isNew()) entityManager.refresh(entity);
    return entity;
  }
}
