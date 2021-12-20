package com.devteam.module.company.core.security;

import java.util.List;


import com.devteam.core.module.security.entity.AccessType;
import com.devteam.core.module.security.entity.AppAccessPermission;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@Getter @Setter
public class CompanyAclModel {
  private AccessType accessType = AccessType.Employee;
  private String     loginId; 
  private Long       companyId;
  private Long       companyParentId;
  private String     companyCode;
  private String     companyLabel;
  private int        priority;
  
  private List<AppAccessPermission> appPermissions;
}
