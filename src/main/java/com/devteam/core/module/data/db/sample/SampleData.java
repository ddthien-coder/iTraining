package com.devteam.core.module.data.db.sample;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.JPAService;
import com.devteam.core.module.data.db.entity.Persistable;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.Getter;

public class SampleData {
  @Getter
  protected ClientInfo client;
  
  @Autowired
  protected JPAService jpaService;
  
  public void init(ClientInfo client) {
    this.client = client;
    initialize(client);
  }
  
  protected void initialize(ClientInfo client) {
  }
  
  
  protected <T extends Persistable<?>> T refresh(T entity) {
    jpaService.refresh(entity);
    return entity;
  }
}
