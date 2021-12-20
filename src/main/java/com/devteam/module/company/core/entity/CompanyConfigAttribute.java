package com.devteam.module.company.core.entity;

import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(
    name = CompanyConfigAttribute.TABLE_NAME,
    indexes = {
        @Index(columnList="name, type"),
    }
)
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor
@Getter @Setter
public class CompanyConfigAttribute extends CompanyEntityAttribute {
  private static final long serialVersionUID = 1L;
  public static final String TABLE_NAME = "company_config_attribute";

  public CompanyConfigAttribute(String name, Object val, String desc) {
    super(name, val, desc);
  }

}
