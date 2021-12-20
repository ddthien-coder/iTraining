package com.devteam.core.module.data.db.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.util.ds.IdentifiableObject;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@Getter @Setter
abstract  public class Persistable<PK extends Serializable> 
  implements org.springframework.data.domain.Persistable<PK>, TenantSupportEntity, IdentifiableObject, Serializable {
  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  protected PK     id;

  @Transient
  protected EditState editState = EditState.ORIGIN;

  @Transient
  protected LoadState loadState = LoadState.FromDB;

  public void markDeleted() { markState(EditState.DELETED); }
  
  public void markModified() { markState(EditState.MODIFIED); }

  protected void markState(EditState state) {
    if(isNew()) {
      throw new RuntimeException("Cannot mark the state when the object is new");
    }
    this.editState = state;
  }

  @JsonIgnore
  @Transient
  public boolean isNew() { return null == getId(); }

  public void set(ClientInfo client) {
  }

  public void set(ClientInfo client, Date time) {
  }
  
  public void set(String remoteUser, Date time) {
  }
  
  public int hashCode() {
    int hashCode = 17;
    hashCode += null == getId() ? 0 : getId().hashCode() * 31;
    return hashCode;
  }

  public String label() { return "N/A"; }
  
  public String identify() {
    if(id == null) return null;
    return id.toString();
  }
}