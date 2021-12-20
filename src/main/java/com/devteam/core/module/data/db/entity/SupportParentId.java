package com.devteam.core.module.data.db.entity;


import com.devteam.core.util.text.StringUtil;

public interface SupportParentId {
  public Long getParentId();
  public String getParentIdPath() ;
  
  default public IDPath parentIdPath() { 
    String parentIdPath = getParentIdPath();
    if(StringUtil.isEmpty(parentIdPath)) return null;
    return new IDPath(parentIdPath); 
  }
}
