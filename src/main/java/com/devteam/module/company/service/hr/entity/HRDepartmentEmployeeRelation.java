package com.devteam.module.company.service.hr.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.devteam.module.company.core.entity.CompanyEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = HRDepartmentEmployeeRelation.TABLE_NAME)
public class HRDepartmentEmployeeRelation extends CompanyEntity {
  private static final long serialVersionUID = 1L;

  final static public String TABLE_NAME = "company_hr_department_employee_rel";

  @NotNull @Min(1)
  @Column(name="department_id")
  private Long departmentId;

  @NotNull @Min(1)
  @Column(name="employee_id")
  private Long employeeId;

  public HRDepartmentEmployeeRelation(HRDepartment companyDepartment, Employee employee) {
    this.companyId = companyDepartment.getCompanyId();
    this.departmentId = companyDepartment.getId();
    this.employeeId = employee.getId();
  }
}
