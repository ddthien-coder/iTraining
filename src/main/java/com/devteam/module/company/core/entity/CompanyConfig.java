package com.devteam.module.company.core.entity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.MapKey;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.util.ds.Collections;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@JsonInclude(Include.NON_NULL)
@Table(
  name = CompanyConfig.TABLE_NAME,
  uniqueConstraints = { 
      @UniqueConstraint(
        name = Company.TABLE_NAME + "company_id",
        columnNames = { "company_id" })
    }
)
@NoArgsConstructor @Getter @Setter
public class CompanyConfig extends CompanyEntity {
  private static final long serialVersionUID = 1L;

  public static final String TABLE_NAME = "company_config";

  private String label;

  @JsonIgnore
  @OneToMany(cascade = {CascadeType.ALL}, orphanRemoval = true, fetch = FetchType.EAGER)
  @JoinColumn(name = "custom_field_definitions_id", referencedColumnName = "id")
  @MapKey(name="name")
  private Map<String, CompanyConfigAttribute> attributes = new HashMap<>();

  public CompanyConfig(String label) {
    this.label = label;
  }
  public List<CompanyConfigAttribute> getListAttributes() {
    return Collections.toList(getAttributes().values());
  }
  
  public void setListAttributes(List<CompanyConfigAttribute> attrs) {
    for(CompanyConfigAttribute sel : attrs) {
      attributes.put(sel.getName(), sel);
    }
  }
  
  public void set(ClientInfo client, Company company) {
    super.set(client);
    for (CompanyConfigAttribute sel : getListAttributes()) {
      this.set(client, company, sel);
    }
  }
  
}
