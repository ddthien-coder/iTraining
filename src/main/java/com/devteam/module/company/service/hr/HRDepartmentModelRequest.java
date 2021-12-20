package com.devteam.module.company.service.hr;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class HRDepartmentModelRequest {
  Long id;
  
  String name;

  boolean loadChildren;
  
  boolean loadEmployees;

  public HRDepartmentModelRequest(Long id) {
    this.id = id ;
  }
  
  public HRDepartmentModelRequest(String name) {
    this.name = name;
  }
  
  public HRDepartmentModelRequest withId(Long id) {
    this.id = id;
    return this;
  }

  public HRDepartmentModelRequest loadEmployees() {
    this.loadEmployees = true;
    return this;
  }
  
  public HRDepartmentModelRequest loadChildren() {
    this.loadChildren = true;
    return this;
  }
}
