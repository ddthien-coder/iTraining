package com.devteam.module.company.core.security;

import java.util.List;

import com.devteam.core.module.security.entity.AccessToken;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @Getter @Setter
public class ACLModel {
  private String                sessionId;
  private AccessToken           accessToken;
  private CompanyAclModel       companyAcl;
  private List<CompanyAclModel> availableCompanyAcls;

  public ACLModel(AccessToken accessToken) {
    this.accessToken = accessToken;
  }

  @JsonIgnore
  public boolean isSuperUser() { return "admin".equals(accessToken.getLoginId()) ; }
  
  public ACLModel withAcessToken(AccessToken token) {
    this.accessToken = token;
    return this;
  }
  
  public ACLModel withAvailableCompanyAcls(List<CompanyAclModel> acls) {
    this.availableCompanyAcls = acls;
    if(acls.size() > 0) {
      this.companyAcl = acls.get(0);
    }
    return this;
  }
}