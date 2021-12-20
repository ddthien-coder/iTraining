package com.devteam.module.company.core.entity;


import com.devteam.core.util.text.StringUtil;

public enum ShareableScope {
  NONE, PRIVATE, COMPANY, DESCENDANTS, ORGANIZATION;
  
  public static ShareableScope toShareableScope(String iShareableScope) {
    ShareableScope shareable = ShareableScope.COMPANY;
    if(StringUtil.isBlank(iShareableScope)) {
      return shareable;
    }
    for (ShareableScope shareableScope : ShareableScope.values()) {
      if (iShareableScope.equals(shareableScope.toString())) {
        shareable = shareableScope;
      }
    }
    return shareable;
  }
};





