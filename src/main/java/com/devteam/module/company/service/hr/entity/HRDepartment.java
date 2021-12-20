package com.devteam.module.company.service.hr.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.devteam.module.company.core.entity.CompanyEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = HRDepartment.TABLE_NAME)
@NoArgsConstructor @Getter @Setter
public class HRDepartment extends CompanyEntity {
  private static final long serialVersionUID = 1L;

  final static public String TABLE_NAME = "company_hr_department";

  @Column(name="parent_id")
  private Long   parentId;

  @Column(name="parent_id_path")
  private String parentIdPath;
  
  private String name;
  private String label;
  private String description;

  public HRDepartment(String name, String label, String desc) {
    this.name        = name;
    this.label       = label;
    this.description = desc;
  }
  
  public HRDepartment withParent(HRDepartment parent) {
    if(parent != null) {
      parentId   = parent.getId();
      parentIdPath = parent.createPath();
    } else {
      parentId = null;
      parentIdPath = null ;
    }
    return this;
  }
  

  public HRDepartment withName(String name) {
    this.name = name;
    return this;
  }

  public HRDepartment withDescription(String description) {
    this.description = description;
    return this;
  }
  
  String createPath() {
    if(parentIdPath == null) return Long.toString(getId());
    return parentIdPath + "/" + Long.toString(getId());
  }
}
