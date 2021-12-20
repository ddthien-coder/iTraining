package com.devteam.module.storage;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.http.upload.UploadResource;
import com.devteam.module.storage.fs.FSStorageService;
import org.springframework.core.io.Resource;



public class UserStorage extends Storage {
  final static public String USER_PATH    = "/users";
  
  private String loginId ;
  
  public UserStorage(ClientInfo client, FSStorageService service, String loginId) {
    super(client, service, USER_PATH + "/" + loginId);
    this.loginId = loginId;
  }
 
  public SNode initStorage() {
    SNode dir = service.initDirectory(client, getSystemPath());
    service.initDirectory(client, getSystemPath("www"));
    return dir;
  }

  protected String getPrivateDownloadUri(String storagePath, UploadResource resource) {
    return "users/private/" + storagePath + "/" + resource.getName();
  }

  protected String getPublicDownloadUri(String storagePath, UploadResource resource) {
    return "users/" + loginId + "/www/" + storagePath + "/" + resource.getName();
  }
  
  protected String getPrivateDownloadUri(String storagePath, StorageResource resource) {
    return "users/private/" + storagePath + "/" + resource.getName();
  }

  protected String getPublicDownloadUri(String storagePath, StorageResource resource) {
    return "users/" + loginId + "/www/" + storagePath + "/" + resource.getName();
  }

  public Resource wwwResource(String path) {
    if(path.startsWith("/")) path = "www"+ path ;
    else path = "www/" + path;
    return service.getContentAsResource(client, getSystemPath(path)) ;
  }
  
  public byte[] wwwData(String path) {
    if(path.startsWith("/")) path = "www"+ path ;
    else path = "www/" + path;
    return service.getContent(client, getSystemPath(path)) ;
  }
}