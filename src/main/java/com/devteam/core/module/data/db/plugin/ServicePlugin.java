package com.devteam.core.module.data.db.plugin;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.plugin.entity.PluginInfo;
import com.devteam.core.module.data.db.plugin.repository.PluginInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.Getter;
import lombok.Setter;

abstract public class ServicePlugin {
  @Autowired
  PluginInfoRepository repo ;

  @Getter
  private String module;
  @Getter
  private String service;
  @Getter
  private String type;

  @Getter @Setter
  private String description;
  
  protected ServicePlugin(String module, String service, String type) {
    this.module  = module;
    this.service = service;
    this.type    = type;
  }

  public PluginInfo createPluginInfo(ClientInfo client) {
    PluginInfo info = new PluginInfo(module, service, type);
    info.setDescription(description);
    info.set(client);
    repo.save(info);
    return info;
  }
  
  public PluginInfo getPluginInfo(ClientInfo client) {
    return repo.getOne(module, service, type);
  }

}
