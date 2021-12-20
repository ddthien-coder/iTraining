package com.devteam.module.company.service.hr.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import com.devteam.core.util.text.DateUtil;
import com.devteam.module.account.entity.Account;
import com.devteam.module.account.entity.UserProfile;
import com.devteam.module.company.core.entity.CompanyEntity;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
  name = Employee.TABLE_NAME,
  uniqueConstraints = {
    @UniqueConstraint(
      name = Employee.TABLE_NAME + "_login_id",
      columnNames = {"company_id", "login_id"}
    ),
  },
  indexes = {
    @Index(columnList="login_id"),
  }
)
@Getter
@Setter
@NoArgsConstructor
public class Employee extends CompanyEntity {
  private static final long serialVersionUID = 1L;
  
  final static public String TABLE_NAME = "company_hr_employee";

  @NotNull
  @Column(name="login_id")
  private String loginId;

  @Column(name="employee_code")
  private String employeeCode;

  @Column(name="employee_card_id")
  private String employeeCardId;
  
  private String label;
  
  //TODO: check and remove this field , it is replaced by the employeeCode
  private String code;

  @Column(name = "employee_tax_code")
  private String  employeeTaxCode;
  
  private int    priority = 5;
  
  private String description;
  
  @JsonFormat(pattern = DateUtil.COMPACT_DATETIME_FORMAT)
  @Column(name="start_date")
  private Date   startDate;
  
  @JsonFormat(pattern = DateUtil.COMPACT_DATETIME_FORMAT)
  @Column(name="end_date")
  private Date   endDate;
  
  public Employee(@NotNull String loginId) {
    this.loginId = loginId;
  }

  public Employee(Account account) {
    this.loginId = account.getLoginId();
    this.label   = account.getFullName();
  }

  public Employee(UserProfile profile) {
    this.loginId = profile.getLoginId();
    this.label   = profile.getFullName();
  }

  public Employee withLabel(String label) {
    this.label = label;
    return this;
  }

  public Employee withPriority(int priority) {
    this.priority = priority;
    return this;
  }

  public Employee withDescription(String description) {
    this.description = description;
    return this;
  }

  public Employee withStartDate(Date startDate) {
    this.startDate = startDate;
    return this;
  }

  public Employee withEndDate(Date endDate) {
    this.endDate = endDate;
    return this;
  }
  
  public String identify() { return loginId; }
}
