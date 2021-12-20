package com.devteam.module.company.service.hr;


import java.util.List;

import com.devteam.module.company.service.hr.entity.Employee;
import com.devteam.module.company.service.hr.entity.HRDepartment;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class HRDepartmentModel {
  HRDepartment hrDepartment;
  List<HRDepartment> children;
  List<Employee>     employees;

  public HRDepartmentModel(HRDepartment dept) {
    this.hrDepartment = dept;
  }
  
  public HRDepartmentModel withDepartment(HRDepartment hrDepartment) {
    this.hrDepartment = hrDepartment;
    return this;
  }

  public HRDepartmentModel withChildren(List<HRDepartment> children) {
    this.children = children;
    return this;
  }

  public HRDepartmentModel withEmployees(List<Employee> employees) {
    this.employees = employees;
    return this;
  }
}
