package com.devteam.module.storage;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.http.upload.UploadResource;
import com.devteam.module.storage.fs.FSStorageService;
import org.springframework.core.io.Resource;


public class CompanyStorage extends Storage {
  final static public String COMPANY_PATH = "/companies";

  public CompanyStorage(ClientInfo client, FSStorageService service, String company) {
    super(client, service, COMPANY_PATH + "/" + company);
  }
  
  protected String getPrivateDownloadUri(String storagePath, StorageResource resource) {
    return "companies/private/" + storagePath + "/" + resource.getName();
  }

  protected String getPublicDownloadUri(String storagePath, StorageResource resource) {
    return null;
  }
  
  protected String getPrivateDownloadUri(String storagePath, UploadResource resource) {
    return "companies/private/" + storagePath + "/" + resource.getName();
  }

  protected String getPublicDownloadUri(String storagePath,UploadResource resource) {
    return null;
  }
  
  public Resource getWWWResource(String path) {
    if(path.startsWith("/")) path = "www"+ path ;
    else path = "www/" + path;
    return getContentAsResource(getSystemPath(path)) ;
  }
}