package com.devteam.module.company.core.entity;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.devteam.core.module.common.ClientInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor
@Getter @Setter
public class CompanyFollower extends CompanyPersistable {
  private static final long serialVersionUID = 1L;

  static public enum Type { Employee, Partner, Email}; 
  
  private Type type = Type.Employee;

  @Column(name="follower_id")
  private String followerId;
  
  @Column(name="follower_full_name")
  private String followerFullName;
  
  public CompanyFollower(Type type, String followerId, String followerFullName) {
    this.type = type;
    this.followerId = followerId;
    this.followerFullName = followerFullName;
  }

  public void set(ClientInfo client, Long companyId) {
    super.set(client); 
    this.companyId = companyId;
  }
}
