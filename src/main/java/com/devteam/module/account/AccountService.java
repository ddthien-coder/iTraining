package com.devteam.module.account;

import java.util.List;

import javax.annotation.PostConstruct;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.common.Result;
import com.devteam.core.module.data.db.entity.ChangeStorageStateRequest;
import com.devteam.core.module.data.db.entity.StorageState;
import com.devteam.core.module.data.db.query.SqlQueryParams;
import com.devteam.core.module.http.upload.UploadResource;
import com.devteam.core.module.security.SecurityLogic;
import com.devteam.core.module.security.entity.AccessToken;
import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;
import com.devteam.module.account.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.Getter;


@Service("AccountService")
public class AccountService {
  @Autowired
  private AccountLogic accountLogic;

  @Autowired
  private AccountGroupLogic groupLogic;

  @Getter
  @Autowired
  private ProfileLogic profileLogic;

  @Autowired
  private SecurityLogic securityLogic;

  @PostConstruct
  public void onInit() {
  }

  @Transactional
  public AccessToken authenticate(ClientInfo client, String loginId, String password, int liveTimeInMin) {
    Account account = accountLogic.authenticate(client, loginId, password);
    if(account == null) {
      return new AccessToken("anon", AccessToken.AccessType.None);
    } 
    AccessToken token = 
        new AccessToken(null, AccessToken.AccessType.Employee)
        .withLabel(account.getFullName())
        .withLoginId(loginId)
        .withGenToken()
        .withLiveTime(liveTimeInMin);
    token = securityLogic.saveAccessToken(client, token);
    return token;
  }

  // Account Group
  @Transactional(readOnly = true)
  public AccountGroup getAccountGroup(ClientInfo client, String name) {
    return groupLogic.getAccountGroup(client, name);
  }
  
  @Transactional(readOnly = true)
  public AccountGroup getAccountGroupById(ClientInfo client, Long id) {
    return groupLogic.getAccountGroupById(client, id);
  }

  @Transactional(readOnly = true)
  public List<AccountGroup> findAccountGroupChildren(ClientInfo client, Long groupId) {
    return groupLogic.findChildren(client, groupId);
  }

  @Transactional
  public AccountGroup createAccountGroup(ClientInfo client, AccountGroup parent, AccountGroup group) {
    return groupLogic.createAccountGroup(client, parent, group);
  }

  @Transactional
  public AccountGroup saveAccountGroup(ClientInfo client, AccountGroup group) {
    return groupLogic.saveAccountGroup(client, group);
  }
  
  @Transactional
  public Boolean deleteAccountGroup(ClientInfo client, Long id) {
    return groupLogic.delete(client, id);
  }

  @Transactional
  public AccountMembership createMembership(ClientInfo client, AccountGroup group, String loginId) {
    return accountLogic.createMembership(client, group, loginId);
  }
  
  @Transactional
  public boolean createAccountMemberships(ClientInfo clientInfo, Long groupId, List<String> accountLoginIds) {
    return groupLogic.createAccountMemberships(clientInfo, groupId, accountLoginIds);
  }
  
  @Transactional
  public boolean deleteAccountMemberships(ClientInfo clientInfo, Long groupId, List<String> accountLoginIds) {
    return groupLogic.deleteAccountMemberships(clientInfo, groupId, accountLoginIds);
  }

  @Transactional
  public UploadResource uploadAvatar(ClientInfo client, String loginId, UploadResource resource, boolean saveOrigin) {
    return profileLogic.uploadAvatar(client, loginId, resource, saveOrigin);
  }

  //Account
  @Transactional
  public NewAccountModel createNewAccount(ClientInfo client, NewAccountModel model) {
    return accountLogic.createNewAccount(client, model);
  }

  @Transactional
  public Account saveAccount(ClientInfo client, Account account) {
    if(account.isNew()) {
      throw new RuntimeError(ErrorType.IllegalArgument, "Expect a created account");
    }
    return accountLogic.updateAccount(client, account);
  }

  @Transactional
  public boolean changeAccountStorageState(ClientInfo client, ChangeStorageStateRequest req) {
    return accountLogic.changeStorageState(client, req);
  }

  @Transactional
  public boolean changeAccountStorageState(ClientInfo client, Account account, StorageState state) {
    return accountLogic.changeStorageState(client, account, state);
  }

  @Transactional(readOnly = true)
  public  List<Account> searchAccounts(ClientInfo client, SqlQueryParams params) {
    return accountLogic.searchAccounts(client, params); 
  }
  
  //Profile
  @Transactional(readOnly = true)
  public <T extends BaseProfile> T getProfile(ClientInfo clientInfo, String loginId) {
    return profileLogic.getProfile(clientInfo, loginId);
  }

  @Transactional
  public UserProfile saveUserProfile(ClientInfo clientInfo, UserProfile profile) {
    return profileLogic.saveUserProfile(clientInfo, profile);
  }

  @Transactional
  public OrgProfile saveOrgProfile(ClientInfo clientInfo, OrgProfile profile) {
    return profileLogic.saveOrgProfile(clientInfo, profile);
  }

  @Transactional(readOnly = true)
  public Account getAccount(ClientInfo client, String loginId) {
    return accountLogic.getModifiableAccount(client, loginId);
  }

  // Account password
  @Transactional
  public Result<Boolean> changePassword(ClientInfo client, ChangePasswordRequest request) {
    return accountLogic.changePassword(client, request);
  }
  @Transactional
  public Result<Boolean> resetPassword(ClientInfo client, ResetPasswordRequest request) {
    return accountLogic.resetPassword(client, request);
  }
}
