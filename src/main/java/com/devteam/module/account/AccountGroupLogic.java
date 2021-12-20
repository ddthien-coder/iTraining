package com.devteam.module.account;

import java.util.List;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.common.ServiceMethodCallback;
import com.devteam.core.module.data.db.DAOService;
import com.devteam.core.util.ds.Objects;
import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;
import com.devteam.module.account.entity.AccountGroup;
import com.devteam.module.account.entity.AccountMembership;
import com.devteam.module.account.repository.AccountGroupRepository;
import com.devteam.module.account.repository.AccountMembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AccountGroupLogic extends DAOService {

  @Autowired
  private AccountGroupRepository groupRepo;

  @Autowired
  private AccountMembershipRepository membershipRepo;

  public AccountGroup getAccountGroup(ClientInfo client, String name) {
    return groupRepo.getByName(name);
  }
  
  public AccountGroup getAccountGroupById(ClientInfo client, Long id) {
    return groupRepo.getById(id);
  }

  List<AccountGroup> findChildren(ClientInfo client, Long groupId) {
    if(groupId == null) return groupRepo.findRootChildren();
    return groupRepo.findChildren(groupId);
  }

  public AccountGroup createAccountGroup(ClientInfo client, AccountGroup parent, AccountGroup group) {
    group.withParent(parent);
    return saveAccountGroup(client, group);
  }

  public AccountGroup saveAccountGroup(ClientInfo client, AccountGroup group) {
    return groupRepo.save(client, group);
  }
  
  public boolean createAccountMemberships(ClientInfo clientInfo, Long groupId, List<String> accountLoginIds) {
    AccountGroup group = groupRepo.getById(groupId);
    Objects.assertNotNull(group, "Group cannot be null");
    if(Objects.nonNull(accountLoginIds)) {
      for(String accountLoginId : accountLoginIds) {
        AccountMembership membership = new AccountMembership();
        membership.set(clientInfo);
        membership.setLoginId(accountLoginId);
        membership.setGroupId(group.getId());
        membershipRepo.save(membership);
      }
    }
    return true;
  }
  
  public boolean deleteAccountMemberships(ClientInfo clientInfo, Long groupId, List<String> accountLoginIds) {
    AccountGroup group = groupRepo.getById(groupId);
    Objects.assertNotNull(group, "Group cannot be null");
    if(Objects.nonNull(accountLoginIds)) {
      for(String accountLoginId : accountLoginIds) {
        AccountMembership membership = membershipRepo.getMembershipByGroupIdAndLoginId(group.getId(), accountLoginId);
        membershipRepo.delete(membership);
      }
    }
    return true;
  }

  public Boolean delete(ClientInfo client, Long id) {
    AccountGroup group = groupRepo.findById(id).get();
    if (group != null) delete(client, group, null);
    return true;
  }

  void delete(ClientInfo client, AccountGroup group, ServiceMethodCallback<AccountService> callback) {
    if (callback != null) callback.onPreMethod();

    List<AccountGroup> children = groupRepo.findChildren(group.getId());
    if(children.size() > 0) {
      throw new RuntimeError(ErrorType.IllegalState, "Cannot delete  group " + group.getLabel() + ", that has the children");
    }
    membershipRepo.deleteByGroup(group.getId());
    groupRepo.delete(group);

    if(callback != null) callback.onPostMethod();
  }
}
