package com.devteam.module.account.http;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.entity.ICompany;
import com.devteam.core.module.http.get.GETContent;
import com.devteam.core.module.http.get.GETHandler;
import com.devteam.module.storage.IStorageService;
import com.devteam.module.storage.UserStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AvartarGETHandler extends GETHandler {
  @Autowired
  private IStorageService service;
  
  protected AvartarGETHandler() {
    super("account-avatar");
  }

  @Override
  public GETContent get(ClientInfo client, ICompany company, String path) {
    return get(path);
  }

  @Override
  public GETContent get(String path) {
    if(path.startsWith("orig/")) {
      String loginId = path.substring("orig".length());
      UserStorage storage = service.createUserStorage(ClientInfo.DEFAULT, loginId);
      byte[] data = storage.wwwData("avatar/orig-avatar.png");
      return new GETContent("orig-avatar.png", data);
    } else {
      String loginId = path;
      UserStorage storage = service.createUserStorage(ClientInfo.DEFAULT, loginId);
      byte[] data = storage.wwwData("avatar/avatar.png");
      return new GETContent("avatar.png", data);
    }
  }

}
