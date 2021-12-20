package com.devteam.module.storage;

import java.io.InputStream;
import java.util.List;
import java.util.Set;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.http.upload.UploadResource;
import com.devteam.module.storage.entity.EntityAttachment;
import org.springframework.core.io.Resource;


public interface IStorageService {
  public SNode createDirectory(ClientInfo client, String dir) ;
  public SNode initDirectory(ClientInfo client, String path) ;

  public SNode ensureNodeExists(String path);
  public SNode ensureNodeWritable(String path);
  
  public boolean hasNode(ClientInfo client, String path) ;
  public SNode getNode(ClientInfo client, String path, boolean loadChildren) ;
  
  public byte[] getContent(ClientInfo client, SNode file) ;
  public byte[] getContent(ClientInfo client, String path) ;
  public InputStream getContentAsInputStream(ClientInfo client, SNode file) ;
  public String getContentAsText(ClientInfo client, SNode file) ;
  public String getContentAsText(ClientInfo client, SNode file, String encoding) ;
  public Resource getContentAsResource(ClientInfo client, String path) ;
  public Resource getWWWResource(String relativePath) ;
  
  public void   saveContent(ClientInfo client, SNode file, byte[] data) ;
  public void   saveContent(ClientInfo client, SNode file, String content) ;
  public void   saveContent(ClientInfo client, SNode file, String content, String encoding) ;
  public SNode  saveContent(ClientInfo client, String path, byte[] data) ;
  
  public StorageResource save(ClientInfo client, String storagePath, StorageResource resource);
  public  List<StorageResource> save(
      ClientInfo client, String storagePath, List<StorageResource> resources, boolean deleteOrphan);
  
  public  UploadResource upload(ClientInfo client, String storagePath, UploadResource resource);
  public  List<UploadResource> upload(ClientInfo client, String storagePath, List<UploadResource> resources, boolean deleteOrphan);
  public <T extends EntityAttachment> List<T> saveAttachments(ClientInfo client, String storagePath, List<T> attachments, boolean removeOrphan) ;

  public boolean deleteSystemDirOrFile(ClientInfo client, String path) ;
  public int deleteNotIn(ClientInfo client, String path, Set<String> names);
  
  public Storage createStorage(ClientInfo client, String baseDir) ;
  public UserStorage createUserStorage(ClientInfo client, String userId) ;
  public CompanyStorage createCompanyStorage(ClientInfo client, String company) ;

  @Deprecated
  public  List<SNode> uploadDep(ClientInfo client, String storagePath, List<UploadResource> resources);
  
}

