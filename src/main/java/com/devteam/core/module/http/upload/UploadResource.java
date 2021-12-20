package com.devteam.core.module.http.upload;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor  @Getter @Setter
public class UploadResource {
  static public enum ProcessStatus {None, Success , Fail} 
  
  private String        storeId;
  private String        name;
  private String        contentType;
  private long          size;

  private String        resourceScheme;   // tmp, storage, db...
  private String        resourceUri;
  private String        downloadUri;
  private String        publicDownloadUri;
  private ProcessStatus processStatus = ProcessStatus.None;

  public UploadResource(String storeId, String name, String contentType, long size) {
    this.storeId = storeId;
    this.name = name;
    this.contentType = contentType;
    this.size = size;
  }
  
  public String rename(String newName, boolean extInclude) {
    if(extInclude) {
      name = newName;
    } else {
      int lastIdx = name.lastIndexOf('.');
      if(lastIdx >= 0) {
        name = newName + name.substring(lastIdx);
      } else {
        name = newName;
      }
    }
    return name;
  }
  
  public UploadResource withResourceScheme(String scheme) {
    this.resourceScheme = scheme;
    return this;
  }

  public UploadResource withResourceUri(String uri) {
    this.resourceUri = uri;
    return this;
  }

  public UploadResource withDownloadUri(String uri) {
    this.downloadUri = uri;
    return this;
  }

  public UploadResource withPublicDownloadUri(String uri) {
    this.publicDownloadUri = uri;
    return this;
  }
}