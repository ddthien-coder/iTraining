package com.devteam.module.account.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.devteam.core.util.text.DateUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
  name = OrgProfile.TABLE_NAME,
  indexes = {
    @Index(columnList="login_id"),
})
@JsonInclude(Include.NON_NULL)
@Getter @Setter
public class OrgProfile extends BaseProfile {
  private static final long serialVersionUID = 1L;

  public static final String TABLE_NAME = "account_org_profile";

  @Transient
  private final AccountType accountType = AccountType.ORGANIZATION;

  private String name;


  @Column(name = "organization_type")
  private String organizationType;
  
  private String slogan;
  
  @JsonFormat(pattern = DateUtil.COMPACT_DATETIME_FORMAT)
  @Column(name = "founding_date")
  private Date   foundingDate;
  
  @JsonFormat(pattern = DateUtil.COMPACT_DATETIME_FORMAT)
  @Column(name = "closing_date")
  private Date   closingDate;
  
  @Column(name = "registration_code")
  private String registrationCode;
  
  @Column(name = "representative_login_id")
  private String representativeLoginId;
  
  private String representative;
  
  private String description;
  
  public OrgProfile() {}
  
  public OrgProfile(String loginId) {
    this.loginId = loginId;
    this.fullName = loginId;
  }
  
  public OrgProfile (String loginId, String fullName, String email) {
    this.loginId = loginId;
    this.fullName = fullName;
    this.email = email;
  }
  
  public OrgProfile withName(String name) {
    this.name = name;
    return this;
  }
  
  public OrgProfile withFullName(String fullName) {
    this.fullName = fullName;
    return this;
  }

  public OrgProfile withEmail(String email) { 
    setEmail(email); 
    return this;
  }
  
  public OrgProfile  withMobile(String mobile) {
    setMobile(mobile);
    return this;
  }
  
  public OrgProfile withOrganizationType(String organizationType) {
    this.organizationType = organizationType;
    return this;
  }
  
  public OrgProfile withSlogan(String slogan) {
    this.slogan = slogan;
    return this;
  }
  
  public OrgProfile withAvatar(String avatar) {
    this.avatarUrl = avatar;
    return this;
  }
  
  public OrgProfile withFoundingDate(Date foundingDate) {
    this.foundingDate = foundingDate;
    return this;
  }
  
  public OrgProfile withClosingDate(Date closingDate) {
    this.closingDate = closingDate;
    return this;
  }
  
  public OrgProfile withRegistrationCode(String registrationCode) {
    this.registrationCode = registrationCode;
    return this;
  }
  
  public OrgProfile withRepresentativeLoginId(String representativeLoginId) {
    this.representativeLoginId = representativeLoginId;
    return this;
  }
  
  public OrgProfile withRepresentative(String representative) {
    this.representative = representative;
    return this;
  }
  
  public OrgProfile withDescription(String description) {
    this.description = description;
    return this;
  }
}
