package com.devteam.module.storage;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import com.devteam.core.util.io.IOUtil;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class StorageResource {
  private String      name;
  private InputStream stream;
  private String      resourceScheme;   // tmp, storage, db...
  private String      resourceUri;
  private String      downloadUri;
  private String      publicDownloadUri;

  public StorageResource(String name, InputStream stream) {
    this.name = name;
    this.stream = stream;
  }
  
  public StorageResource(String name, byte[] data) {
    this.name = name;
    this.stream = new ByteArrayInputStream(data);
  }
  
  public byte[] toBytes() {
    return IOUtil.getStreamContentAsBytes(stream);
  }
}
