package com.devteam.core.module.security;

import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.query.SqlQueryParams;
import com.devteam.core.module.security.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SecurityService {

  @Autowired
  SecurityLogic logic;

  @Transactional(readOnly = true)
  public App getApp(ClientInfo client, String module, String name) {
    return logic.getApp(client, module, name);
  }

  @Transactional
  public App saveApp(ClientInfo client, App app) {
    return logic.saveApp(client, app);
  }

  @Transactional(readOnly = true)
  public List<App> findApps(ClientInfo client) {
    return logic.findApps(client);
  }

  @Transactional
  public AppPermission saveAppPermisson(ClientInfo client, AppPermission permisson) {
    return logic.saveAppPermisson(client, permisson);
  }

  @Transactional
  public List<AppPermission> saveAppPermissions(ClientInfo client, List<AppPermission> permissions) {
    return logic.saveAppPermissions(client, permissions);
  }
  
  @Transactional
  public List<AppPermission> findAppPermissions(ClientInfo client, Long companyId, String loginId) {
    return logic.findAppPermissions(client, companyId, loginId);
  }
  
  @Transactional
  public boolean deletePermissions(ClientInfo client, List<AppPermission> permissions) {
    return logic.deletePermissions(client, permissions);
  }
  
  @Transactional
  public boolean deletePermissionsById(ClientInfo client, List<Long> permissionsIds) {
    return logic.deletePermissionsByIds(client, permissionsIds);
  }

  @Transactional(readOnly=true)
  public List<AppAccessPermission> findPermissions(ClientInfo client, Long companyId, AccessType accessType, String loginId) {
    return logic.findPermissions(client, companyId, accessType, loginId);
  }
  
  @Transactional(readOnly=true)
  public List<AppAccessPermission> searchPermissions(ClientInfo client, Long companyId, SqlQueryParams params) {
    return logic.searchPermissions(client, companyId, params);
  }

  //Access Token
  
  @Transactional(readOnly=true)
  public AccessToken validateAccessToken(ClientInfo client, String token) {
    AccessToken accessToken = logic.getAccessToken(client, token);
    if(accessToken == null || accessToken.isExpired()) {
      return new AccessToken("anon", AccessToken.AccessType.None);
    }
    return accessToken;
  }
  
  
  @Transactional(readOnly=true)
  public AccessToken getAccessToken(ClientInfo client, String token) {
    return logic.getAccessToken(client, token);
  }

  @Transactional
  public AccessToken saveAccessToken(ClientInfo client, AccessToken token) {
    return logic.saveAccessToken(client, token);
  }

  @Transactional(readOnly=true)
  public List<AccessToken> searchAccessTokens(ClientInfo client, Long companyId, SqlQueryParams params) {
    return logic.searchAccessTokens(client, companyId, params);
  }

}
