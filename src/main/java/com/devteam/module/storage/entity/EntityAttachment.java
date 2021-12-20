package com.devteam.module.storage.entity;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.devteam.core.module.http.upload.UploadResource;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor
@Getter @Setter
public class EntityAttachment extends PersistableEntity<Long> {
  private String name;
  private String label;
  private long   size;
  private String description;

  @Column(name = "resource_uri")
  private String resourceUri;
  
  @Column(name = "download_uri")
  private String downloadUri;
  
  @Column(name = "public_download_uri")
  private String publicDownloadUri;
  
  @Transient
  private UploadResource uploadResource;
  
  public EntityAttachment(String name, String label, String description) {
    this.name = name;
    this.label = label;
    this.description = description;
  }

  public <T extends EntityAttachment> T withUploadResource(UploadResource uploadResource) {
    if(name == null) name = uploadResource.getName();
    if(label == null) label = uploadResource.getName();
    size = uploadResource.getSize();
    this.resourceUri = uploadResource.getResourceUri();
    this.downloadUri = uploadResource.getDownloadUri();
    this.publicDownloadUri = uploadResource.getPublicDownloadUri();
    this.uploadResource = uploadResource;
    return (T) this;
  }
  
  public <T extends EntityAttachment> T withResourceUri(String uri) {
    this.resourceUri = uri;
    return (T)this;
  }

  public <T extends EntityAttachment> T withDownloaUri(String uri) {
    this.downloadUri = uri;
    return (T)this;
  }

  public <T extends EntityAttachment> T withPublicDownloaUri(String uri) {
    this.publicDownloadUri = uri;
    return (T)this;
  }
  
  public String identify() { return name; }
}
 