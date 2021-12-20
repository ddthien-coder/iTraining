package com.devteam.core.module.data.db.entity;


import com.devteam.core.module.common.ClientInfo;

public interface ICompanyEntity  {
  public Long getCompanyId() ;
  public void setCompanyId(Long id);
  public void set(ClientInfo client, Long companyId) ;
}
