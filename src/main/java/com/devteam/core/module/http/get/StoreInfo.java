package com.devteam.core.module.http.get;

import lombok.Getter;

@Getter
public class StoreInfo {
  private String storeId;
  private String fileName;
  private String mimeType;
  private long   size;
  
  public StoreInfo(String storeId, GETContent content) {
    this.storeId  = storeId;
    this.fileName = content.getFileName();
    this.size     = content.getSize();
    this.mimeType = content.getMimeType();
  }
}
