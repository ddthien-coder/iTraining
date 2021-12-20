package com.devteam.module.account;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.DAOService;
import com.devteam.core.module.http.upload.UploadResource;
import com.devteam.core.module.http.upload.UploadService;
import com.devteam.core.util.avatar.AvatarUtil;
import com.devteam.core.util.ds.Objects;
import com.devteam.module.account.entity.*;
import com.devteam.module.account.repository.OrgProfileRepository;
import com.devteam.module.account.repository.UserProfileRepository;
import com.devteam.module.storage.IStorageService;
import com.devteam.module.storage.StorageResource;
import com.devteam.module.storage.UserStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProfileLogic extends DAOService {
  final static String PROFILE_PREFIX_USER = "account_user_profile" ;
  
  final static String PROFILE_PREFIX_ORG = "account_org_profile" ;
 
  @Autowired
  private AccountLogic accountLogic;
  
  @Autowired
  private UserProfileRepository userProfileRepo;
  
  @Autowired
  private OrgProfileRepository orgProfileRepo;

  @Autowired
  private UploadService uploadService;
  
  @Autowired
  private IStorageService storageService;
  
  @SuppressWarnings("unchecked")
  public <T extends BaseProfile> T getProfile(ClientInfo clientInfo, String loginId) {
    Account account = accountLogic.getAccount(clientInfo, loginId);
    if(account == null) return null;
    if(account.getAccountType() == AccountType.USER) {
      return (T) getUserProfile(clientInfo, loginId);
    }
    return (T) getOrgProfile(clientInfo, loginId);
  }
  
  //@Cacheable(value = CachingConfig.REGION_ENTITY , key= "{'" + PROFILE_PREFIX_USER + "', #loginId}")
  public UserProfile getUserProfile(ClientInfo clientInfo, String loginId) {
    return userProfileRepo.getByLoginId(loginId);
  }
  
  //@Cacheable(value = CachingConfig.REGION_ENTITY , key= "{'" + PROFILE_PREFIX_ORG + "', #loginId}")
  public OrgProfile getOrgProfile(ClientInfo clientInfo, String loginId) {
    return orgProfileRepo.getByLoginId(loginId);
  }
  
  //@CacheEvict(value = CachingConfig.REGION_ENTITY , key= "{'" + PROFILE_PREFIX_USER + "', #profile.loginId}")
  public UserProfile saveUserProfile(ClientInfo client, UserProfile profile) {
    accountLogic.syncWithProfile(client, profile);
    profile = userProfileRepo.save(client, profile);
    return profile;
  }

  //@CacheEvict(value = CachingConfig.REGION_ENTITY , key= "{'" + PROFILE_PREFIX_ORG + "', #profile.loginId}")
  public OrgProfile saveOrgProfile(ClientInfo client, OrgProfile profile) {
    accountLogic.syncWithProfile(client, profile);
    profile = orgProfileRepo.save(client, profile);
    return profile;
  }

  public UploadResource uploadAvatar(ClientInfo client, String loginId, UploadResource resource, boolean saveOrigin) {
    Account account = accountLogic.getAccount(client, loginId);
    if(account == null) {
      Objects.assertNotNull(account, "Cannot find the account for {}", loginId);
    }
    byte[] imgData = uploadService.load(resource.getStoreId());
    byte[] pngImgData = AvatarUtil.toPng(imgData);
    UserStorage storage = storageService.createUserStorage(client, loginId);
    if(saveOrigin) {
      StorageResource origAvatarResource = new StorageResource("orig-avatar.png", pngImgData);
      origAvatarResource = storage.wwwSave("avatar", origAvatarResource);
    }
    StorageResource avatarResource = new StorageResource("avatar.png", pngImgData);
    avatarResource = storage.wwwSave("avatar", avatarResource);

    if(account.getAccountType() == AccountType.USER) {
      UserProfile profile = getUserProfile(client, loginId) ;
      profile.setAvatarUrl(avatarResource.getPublicDownloadUri());
      saveUserProfile(client, profile);
    } else {
      OrgProfile profile = getOrgProfile(client, loginId) ;
      profile.setAvatarUrl(avatarResource.getPublicDownloadUri());
      saveOrgProfile(client, profile);
    }
    return resource;
  }

}
