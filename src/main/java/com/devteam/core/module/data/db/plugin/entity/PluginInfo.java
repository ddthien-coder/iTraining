package com.devteam.core.module.data.db.plugin.entity;

import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
  name = PluginInfo.TABLE_NAME, 
  uniqueConstraints = { 
    @UniqueConstraint( 
      name = PluginInfo.TABLE_NAME + "_type",
      columnNames = { "module", "service", "type" }), 
  }, 
  indexes = { 
    @Index(columnList = "type, service, module") 
  }
)
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor @Getter @Setter
public class PluginInfo extends PersistableEntity<Long> {
  public static final String TABLE_NAME = "core_plugin_info";

  @NotNull
  private String module;
  @NotNull
  private String service;
  @NotNull
  private String type;
  private String label;
  private String description;
  
  
  public PluginInfo(String module, String service, String type) {
    this.module  = module;
    this.service = service;
    this.type    = type;
    this.label   = type;
  }
}