package com.devteam.core.module.security.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@JsonInclude(Include.NON_NULL)
@Table(
  name = App.TABLE_NAME,
  indexes = { 
    @Index(columnList = "name")
  }
)
@NoArgsConstructor @Getter @Setter
public class App extends PersistableEntity<Long> {
  private static final long serialVersionUID = 1L;

  public static final String TABLE_NAME = "security_app";

  @NotNull
  private String     module;

  @NotNull
  private String     name;
 
  @Column(name="required_capability")
  private Capability requiredCapability;

  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "app_id", referencedColumnName = "id")
  private List<AppRole> roles  = new ArrayList<>();
  
  @Column(name="company_app")
  private boolean    companyApp;
  
  private String     label;
  private String     description;

  public App(@NotNull String module, @NotNull String name) {
    this.module = module;
    this.name = name;
    this.label = name;
  }
  
  public App withRequiredCapability(Capability capability) {
    this.requiredCapability = capability;
    return this;
  }
}