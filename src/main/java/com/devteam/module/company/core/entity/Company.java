package com.devteam.module.company.core.entity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import com.devteam.core.module.data.db.entity.ICompany;
import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.devteam.core.module.data.db.entity.SupportParentId;
import com.devteam.core.util.ds.Objects;
import com.devteam.core.util.text.DateUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@JsonInclude(Include.NON_NULL)
@Table(
  name = Company.TABLE_NAME,
  uniqueConstraints = { 
    @UniqueConstraint(
      name = Company.TABLE_NAME + "_code",
      columnNames = { "code" })
  }, 
  indexes = {
    @Index(columnList = "code")
  }
)
@NoArgsConstructor @Getter @Setter
public class Company extends PersistableEntity<Long> implements ICompany, SupportParentId {
  private static final long serialVersionUID = 1L;

  public static final String TABLE_NAME = "company";

  @NotNull
  private String code;
  
  private String label;
  
  @Column(name="full_name")
  private String fullName;

  @Column(name="parent_id")
  private Long parentId;
  
  @Column(name="parent_label")
  private String parentLabel;
  
  @Column(name="parent_path_id")
  private String parentIdPath;
  
  @Column(name="account_admin_login_id")
  private String adminAccountLoginId;
  
  @JsonFormat(pattern = DateUtil.COMPACT_DATETIME_FORMAT)
  @Column(name="founding_date")
  private Date   foundingDate;
  
  @JsonFormat(pattern = DateUtil.COMPACT_DATETIME_FORMAT)
  @Column(name="closing_date")
  private Date   closingDate;
  
  @Column(name="registration_code")
  private String registrationCode;
  
  private String description;

  public Company(String code, String label) {
    this.code = code;
    this.label = label;
  }

  public List<Long> findCompanyIdPaths() {
    List<Long> holder = new ArrayList<>();
    if (Objects.nonNull(parentIdPath)) {
      List<String> ids = Arrays.asList(parentIdPath.split("/"));
      holder.addAll(ids.stream().map(Long::parseLong).collect(Collectors.toList()));
    }
    
    holder.add(getId());
    return holder;
  }
  
  public Company withCode(String code) {
    this.code = code;
    return this;
  }
  
  public Company withLabel(String label) {
    this.label = label;
    return this;
  }

  public Company withDescription(String description) {
    this.description = description;
    return this;
  }
  
  public Company withFullName(String fullName) {
    this.fullName = fullName;
    return this;
  }
  
  public Company withRegistrationCode(String registrationCode) {
    this.registrationCode = registrationCode;
      return this;
  }
  
  public Company withLoginAccountLoginId(String adminLoginId) {
    this.adminAccountLoginId = adminLoginId;
    return this;
  }
  
  
  public Company withParent(Company parent) {
    Objects.assertTrue(!parent.isNew());
    this.parentId = parent.getId();
    this.parentLabel = parent.getLabel();
    if (parent.getParentIdPath() == null) {
      this.parentIdPath = Long.toString(parent.getId());
    } else {
      this.parentIdPath = parent.getParentIdPath() + "/" + parent.getId();
    }
    return this;
  }

  public Company withFoundingDate(Date foundingDate) {
    this.foundingDate = foundingDate;
    return this;
  }
}
