package com.devteam.module.storage;

import java.io.InputStream;
import java.util.List;
import java.util.Set;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.http.upload.UploadResource;
import com.devteam.module.storage.entity.EntityAttachment;
import com.devteam.module.storage.fs.FSStorageService;
import org.springframework.core.io.Resource;


public class Storage {
  protected ClientInfo client;
  protected IStorageService service;
  protected String baseDir;
  
  public Storage(ClientInfo client, FSStorageService service, String baseDir) {
    this.client = client;
    this.service = service;
    this.baseDir = baseDir;
  }
  
  public boolean hasNode(String path) {
    return service.hasNode(client, getSystemPath(path));
  }

  public SNode getNode(String relativePath, boolean loadChildren) {
    return service.getNode(client, getSystemPath(relativePath), loadChildren );
  }

  public SNode initDirectory(String relativePath) {
    return service.initDirectory(client, getSystemPath(relativePath));
  }

  public SNode createDirectory(String relativePath) {
    return service.initDirectory(client, getSystemPath(relativePath));
  }

  public byte[] getContent(String relativePath) {
    String sysPath = getSystemPath(relativePath);
    return service.getContent(client, service.ensureNodeExists(sysPath));
  }
  
  public InputStream getContentAsInputStream(String relativePath) {
    String realPath = getSystemPath(relativePath);
    return service.getContentAsInputStream(client, service.ensureNodeExists(realPath));
  }

  public String getContentAsText(String relativePath) {
    String realPath = getSystemPath(relativePath);
    return service.getContentAsText(client, service.ensureNodeExists(realPath));
  }
  
  public String getContentAsText(String relativePath, String encoding) {
    String realPath = getSystemPath(relativePath);
    return service.getContentAsText(client, service.ensureNodeExists(realPath), encoding);
  }
  
  public Resource getContentAsResource(String path) {
    String storagePath = getSystemPath(path);
    return service.getContentAsResource(client, storagePath) ;
  }
  
  public SNode  saveContent(String relativePath, byte[] data) {
    SNode file = service.ensureNodeWritable(getSystemPath(relativePath));
    service.saveContent(client, file, data);
    return file;
  }
  
  public SNode  saveContent(String relativePath, String content)  {
    SNode file = service.ensureNodeWritable(getSystemPath(relativePath));
    service.saveContent(client, file, content);
    return file;
  }

  public  StorageResource save(String storagePath, StorageResource resource) {
    resource = service.save(client, getSystemPath(storagePath), resource);
    resource.setDownloadUri(getPrivateDownloadUri(storagePath, resource));
    resource.setPublicDownloadUri(null);
    return resource;
  }
  
  public  List<StorageResource> save(String storagePath, List<StorageResource> resources, boolean deleteOrphan) {
    resources = service.save(client, getSystemPath(storagePath), resources, deleteOrphan);
    for(StorageResource resource : resources) {
      resource.setDownloadUri(getPrivateDownloadUri(storagePath, resource));
      resource.setPublicDownloadUri(null);
    }
    return resources;
  }
  
  public  StorageResource wwwSave(String storagePath, StorageResource resource) {
    String wwwStoragePath = null;
    if(storagePath.startsWith("/")) wwwStoragePath = "www" + storagePath ;
    else wwwStoragePath = "www/" + storagePath;
    resource = service.save(client, getSystemPath(wwwStoragePath), resource);
    resource.setDownloadUri(getPrivateDownloadUri(wwwStoragePath, resource));
    resource.setPublicDownloadUri(getPublicDownloadUri(storagePath, resource));
    return resource;
  }

  public  UploadResource upload(String storagePath, UploadResource resource) {
    resource = service.upload(client, getSystemPath(storagePath), resource);
    resource.withDownloadUri(getPrivateDownloadUri(storagePath, resource));
    resource.withPublicDownloadUri(null);
    return resource;
  }

  public  UploadResource wwwUpload(String storagePath, UploadResource resource) {
    String wwwStoragePath = null;
    if(storagePath.startsWith("/")) wwwStoragePath = "www" + storagePath ;
    else wwwStoragePath = "www/" + storagePath;
    resource = service.upload(client, getSystemPath(wwwStoragePath), resource);
    resource.withDownloadUri(getPrivateDownloadUri(wwwStoragePath, resource));
    resource.withPublicDownloadUri(getPublicDownloadUri(storagePath, resource));
    return resource;
  }

  public  List<UploadResource> upload(String storagePath, List<UploadResource> resources, boolean deleteOrphan) {
    resources = service.upload(client, getSystemPath(storagePath), resources, deleteOrphan);
    for(UploadResource resource : resources) {
      resource.withDownloadUri(getPrivateDownloadUri(storagePath, resource));
      resource.withPublicDownloadUri(null);
    }
    return resources;
  }

  public <T extends EntityAttachment> List<T> saveAttachments(String storagePath, List<T> attachments, boolean removeOrphan) {
    attachments = service.saveAttachments(client, getSystemPath(storagePath), attachments, removeOrphan);
    for(EntityAttachment attachment : attachments) {
      UploadResource resource = attachment.getUploadResource();
      if(resource == null) continue;
      resource.withDownloadUri(getPrivateDownloadUri(storagePath, resource));
      resource.withPublicDownloadUri(null);
      attachment.withDownloaUri(resource.getDownloadUri());
      attachment.withPublicDownloaUri(resource.getPublicDownloadUri());
    }
    return attachments;
  }
  
  public boolean delete(String relativePath) {
    String realPath = getSystemPath(relativePath);
    return service.deleteSystemDirOrFile(client, realPath);
  }

  public int deleteNotIn(String relativeDir, Set<String> names) {
    String sysPath = getSystemPath(relativeDir);
    return service.deleteNotIn(client, sysPath, names);
  }

  protected String getPrivateDownloadUri(String storagePath,UploadResource resource) {
    return resource.getDownloadUri();
  }

  protected String getPublicDownloadUri(String storagePath,UploadResource resource) {
    return null;
  }
  
  protected String getPrivateDownloadUri(String storagePath, StorageResource resource) {
    return resource.getDownloadUri();
  }

  protected String getPublicDownloadUri(String storagePath, StorageResource resource) {
    return null;
  }

  @Deprecated
  public  List<SNode> uploadDep(String storagePath, List<UploadResource> resources) {
    return service.uploadDep(client, getSystemPath(storagePath), resources);
  }
  
  String getSystemPath() { return baseDir; }
  
  String getSystemPath(String relativePath) { 
    if(relativePath == null) return baseDir;
    return baseDir + "/" + relativePath; 
  }
}