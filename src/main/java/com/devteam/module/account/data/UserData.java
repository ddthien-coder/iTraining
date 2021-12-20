package com.devteam.module.account.data;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.sample.EntityDB;
import com.devteam.core.util.dataformat.DataSerializer;
import com.devteam.core.util.text.DateUtil;
import com.devteam.module.account.AccountService;
import com.devteam.module.account.NewAccountModel;
import com.devteam.module.account.entity.AccountGroup;
import com.devteam.module.account.entity.AccountType;
import com.devteam.module.account.entity.UserProfile;
import org.junit.jupiter.api.Assertions;
import org.springframework.beans.factory.annotation.Autowired;

public class UserData extends AccountData {
  static DateUtil.DateRandomizer DATE_RANDOMIZER = new DateUtil.DateRandomizer("1/1/2017@00:00:00", null);
  static AccountType USER         = AccountType.USER;

  @Autowired
  private AccountService accountService;

  public UserProfile LIEN;
  public UserProfile THIEN;

  public void initialize(ClientInfo client) {
    GroupData GROUP_DATA = EntityDB.getInstance().getData(GroupData.class);
    LIEN = EntityDB.getInstance().getData(ThienData.class).PROFILE;

    THIEN =
        new UserProfile("Thien", "Thien Dinh", "devteamvietnam@gmail.com").
            withMobile("0337303666");
    THIEN = createAccount(THIEN, GROUP_DATA.EMPLOYEES);
  }

  private UserProfile createAccount(UserProfile profile, AccountGroup... group) {
    NewAccountModel model = new NewAccountModel().withUserProfile(profile, profile.getLoginId());
    profile = accountService.createNewAccount(ClientInfo.DEFAULT, model).getUserProfile();
    for(AccountGroup sel : group) {
      accountService.createMembership(ClientInfo.DEFAULT, sel, profile.getLoginId());
    }
    return profile;
  }

  public void assertAll(ClientInfo client) throws Exception {
    UserProfile modifiedFullName = DataSerializer.JSON.clone(THIEN);
    modifiedFullName.setFullName("Thien Update");
    new UserProfileAssert(client, THIEN)
      .assertEntityCreated()
      .assertSave(modifiedFullName, (updateProfile) -> {
        Assertions.assertEquals("Thien Update", updateProfile.getFullName());
      });
  }

}
