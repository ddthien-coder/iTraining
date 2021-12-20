package com.devteam.core.module.data.db.entity;

import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor @Getter @Setter
public class EntityTag extends PersistableEntity<Long> {
  @NotNull
  private String name;
  private String label;
  private String description;

  public EntityTag(String name, String label) {
    this.name    = name;
    this.label   = label;
  }

  public <T extends EntityTag> T withName(String name) {
    this.name = name;
    return (T)this;
  }

  public <T extends EntityTag> T withLabel(String label) {
    this.label = label;
    return (T)this;
  }

  public <T extends EntityTag> T withDescription(String desc) {
    this.description = desc;
    return (T)this;
  }
  
  @Override
  public int hashCode() {
    return name.hashCode();
  }
}