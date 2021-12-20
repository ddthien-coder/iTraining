package com.devteam.module.account.data;


import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.sample.EntityDB;
import com.devteam.core.util.dataformat.DataSerializer;
import com.devteam.core.util.text.DateUtil;
import com.devteam.module.account.AccountService;
import com.devteam.module.account.NewAccountModel;
import com.devteam.module.account.entity.AccountGroup;
import com.devteam.module.account.entity.AccountType;
import com.devteam.module.account.entity.OrgProfile;
import org.junit.jupiter.api.Assertions;
import org.springframework.beans.factory.annotation.Autowired;


public class OrgData extends AccountData {
  static DateUtil.DateRandomizer DATE_RANDOMIZER = new DateUtil.DateRandomizer("1/1/2017@00:00:00", null);
  static AccountType ORGANIZATION = AccountType.ORGANIZATION;

  @Autowired
  AccountService accountService;

  public OrgProfile  IT;
  public OrgProfile  IT_DEV;


  public void initialize(ClientInfo client) {
    final GroupData GROUP_DATA = EntityDB.getInstance().getData(GroupData.class);
    final UserData USER_DATA = EntityDB.getInstance().getData(UserData.class);

    IT =  new OrgProfile("it")
          .withEmail("contact@devteam.com")
          .withMobile("0845505505");
    IT = createAccount(IT, GROUP_DATA.EMPLOYEES);

    IT_DEV =  new OrgProfile("dev")
        .withEmail("dev@gmail.com")
        .withMobile("0845505506")
        .withRepresentativeLoginId(USER_DATA.THIEN.getLoginId())
        .withRepresentative(USER_DATA.THIEN.getFullName());
    IT_DEV = createAccount(IT_DEV, GROUP_DATA.PARTNERS);

  }

  private OrgProfile createAccount(OrgProfile profile,  AccountGroup... group) {
    NewAccountModel model = new NewAccountModel().withOrgProfile(profile, profile.getLoginId());
    profile = accountService.createNewAccount(ClientInfo.DEFAULT, model).getOrgProfile();
    for (AccountGroup sel : group) {
      accountService.createMembership(ClientInfo.DEFAULT, sel, profile.getLoginId());
    }
    return profile;
  }

  public void assertAll(ClientInfo client) throws Exception {
    OrgProfile modifieldEmail = DataSerializer.JSON.clone(IT);
    modifieldEmail.setEmail("dev@devteam.com");
    new OrgProfileAssert(client, IT)
      .assertSave(modifieldEmail, (updateProfile) -> {
        Assertions.assertEquals("dev@devteam.com", updateProfile.getEmail());
      });
  }
}
