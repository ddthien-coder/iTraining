package com.devteam.module.storage.fs;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.PostConstruct;

import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.http.upload.UploadResource;
import com.devteam.core.module.http.upload.UploadService;
import com.devteam.core.module.srpingframework.app.AppEnv;
import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;
import com.devteam.core.util.io.FileUtil;
import com.devteam.core.util.io.IOUtil;
import com.devteam.core.util.text.StringUtil;
import com.devteam.module.storage.*;
import com.devteam.module.storage.entity.EntityAttachment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;



@Service
public class FSStorageService implements IStorageService {
  private static final Logger logger = LoggerFactory.getLogger(FSStorageService.class);
  final static public String WWW_PATH    = "/www";
  
  @Autowired
  private AppEnv appEnv;
  
  @Value("${storage.service.dir}")
  private String storageDir ;
  
  @Autowired
  private UploadService uploadService;
  
  @PostConstruct
  public void init() {
    storageDir = appEnv.getStorageDir();
    File file = new File(storageDir);
    if(file.exists()) {
      if(!file.isDirectory()) {
        throw new RuntimeError(ErrorType.IllegalState, "Expect " + storageDir + " is a directory");
      }
    } else {
      file.mkdirs();
    }
    createDirectory(WWW_PATH, false);
    createDirectory(UserStorage.USER_PATH, false);
    createDirectory(CompanyStorage.COMPANY_PATH, false);
  }

  public SNode initDirectory(ClientInfo client, String path) {
    return createDirectory(path, false);
  }
  
  public SNode createDirectory(ClientInfo client, String path) {
    return createDirectory(path, true);
  }
  
  SNode createDirectory(String path, boolean createNew) {
    File file = new File(storageDir + path);
    if(createNew && file.exists()) {
      throw new RuntimeError(ErrorType.IllegalState, path + " is already exists");
    }
    if(file.exists() && !file.isDirectory()) {
      throw new RuntimeError(ErrorType.IllegalState, path + " is already exists and not a directory");
    } else {
      file.mkdirs();
    }
    return new SNode(file.getName(), path, SNode.Type.Directory);
  }
  
  public boolean hasNode(ClientInfo client, String path) {
    return hasSNode(path);
  }
  
  public SNode getNode(ClientInfo client, String path, boolean loadChildren) {
    File file = ensureSystemFileExists(path) ;
    SNode snode = new SNode(file.getName(), path, SNode.Type.File);
    if(file.isDirectory()) {
      snode.setType(SNode.Type.Directory);
      if(loadChildren)  {
        List<SNode> holder = new ArrayList<>();
        for(File child : file.listFiles()) {
          SNode.Type type = SNode.Type.File;
          if(child.isDirectory()) type = SNode.Type.Directory;
          if(path.equals("/")) {
            holder.add(new SNode(child.getName(), path + child.getName(), type));
          } else {
            SNode childNode = new SNode(child.getName(), path + "/" + child.getName(), type);
            childNode.setSize(child.length());
            holder.add(childNode);
          }
        }
        snode.setChildren(holder);
      }
    }
    return snode;
  }
  
  public byte[] getContent(ClientInfo client, SNode file) {
    File sysFile = ensureSystemFileExists(file.getPath()) ;
    try {
      return IOUtil.getFileContentAsBytes(sysFile);
    } catch (Exception e) {
      throw new RuntimeError(ErrorType.Unknown, "Cannot read content for " + file.getPath(), e);
    }
  }

  public InputStream getContentAsInputStream(ClientInfo client, SNode file) {
    File sysFile = ensureSystemFileExists(file.getPath()) ;
    try {
      return new BufferedInputStream(new FileInputStream(sysFile));
    } catch (Exception e) {
      throw new RuntimeError(ErrorType.Unknown, "Cannot read content for " + file.getPath(), e);
    }
  }

  public byte[] getContent(ClientInfo client, String path) {
    return data(path);
  }

  public Resource getContentAsResource(ClientInfo client, String path) {
    return resource(path);
  }

  public Resource getWWWResource(String path) {
    if(path.startsWith("/")) return resource(WWW_PATH  + path) ;
    return resource(WWW_PATH + "/" + path) ;
  }

  Resource resource(String path) {
    if(!path.startsWith("/")) path = "/" + path;
    try {
      File file = ensureSystemFileExists(path);
      Resource resource = new UrlResource(file.toURI());
      return resource;
    } catch (MalformedURLException e) {
      String message = path + " does not exist";
      logger.error(message);
      Resource resource = new ByteArrayResource(message.getBytes(), "path not found");
      return resource;
    }
  }
  
  byte[] data(String path) {
    if(!path.startsWith("/")) path = "/" + path;
    try {
      File file = ensureSystemFileExists(path);
      return IOUtil.getStreamContentAsBytes(new FileInputStream(file));
    } catch (IOException e) {
      String message = path + " does not exist";
      throw new RuntimeError(ErrorType.IllegalArgument, message, e);
    }
  }
  
  public String getContentAsText(ClientInfo client, SNode file) {
    return getContentAsText(client, file, "UTF-8");
  }
  
  public String getContentAsText(ClientInfo client, SNode file, String encoding) {
    try {
      return new String(getContent(client, file), "UTF-8");
    } catch (UnsupportedEncodingException e) {
      throw new RuntimeError(ErrorType.IllegalArgument, "Not Support Encoding " + encoding, e);
    }
  }
  
  public void saveContent(ClientInfo client, SNode file, byte[] data) {//
    File sysFile = new File(storageDir + file.getPath());
    try {
      IOUtil.save(sysFile, data);
    } catch (IOException e) {
      throw new RuntimeError(ErrorType.Unknown, "Cannot save content for " + file.getPath(), e);
    }
  }
  
  public void saveContent(ClientInfo client, SNode file, String content) {
    saveContent(client, file, content, "UTF-8");
  }
  
  public void saveContent(ClientInfo client, SNode file, String content, String encoding) {
    try {
      this.saveContent(client, file, content.getBytes(encoding));
    } catch (UnsupportedEncodingException e) {
      throw new RuntimeError(ErrorType.IllegalArgument, "Not support Encoding " + encoding, e);
    }
  }

  public SNode  saveContent(ClientInfo client, String path, byte[] data) {
    SNode file = ensureNodeWritable(path);
    saveContent(client, file, data);
    return file;
  }
  
  public StorageResource save(ClientInfo client, String storagePath, StorageResource resource) {
    createDirectory(storagePath, false);
    String fileName = resource.getName();
    byte[] data = resource.toBytes();
    SNode nodeFile = new SNode(fileName, storagePath + "/" + fileName, SNode.Type.File);
    saveContent(client, nodeFile, data);
    resource.setResourceScheme("storage");
    resource.setResourceUri(nodeFile.getPath());
    resource.setDownloadUri(nodeFile.getPath());
    return resource;
  }
  
  public  List<StorageResource> save(
      ClientInfo client, String storagePath, List<StorageResource> resources, boolean deleteOrphan) {
    createDirectory(storagePath, false);
    Set<String> names = new HashSet<String>();

    for(StorageResource resource: resources) {
      byte[] data = resource.toBytes();
      String fileName = resource.getName();
      SNode nodeFile = new SNode(fileName, storagePath + "/" + fileName, SNode.Type.File);
      saveContent(client, nodeFile, data);
      resource.setResourceScheme("storage");
      resource.setResourceUri(nodeFile.getPath());
      resource.setDownloadUri(nodeFile.getPath());
    }
    if(deleteOrphan) {
      deleteNotIn(client, storagePath, names);
    }
    return resources;
  }

  public UploadResource upload(ClientInfo client, String storagePath, UploadResource resource) {
    createDirectory(storagePath, false);
    String storeId = resource.getStoreId();
    String fileName = resource.getName();
    byte[] data = uploadService.load(storeId);
    SNode nodeFile = new SNode(fileName, storagePath + "/" + fileName, SNode.Type.File);
    saveContent(client, nodeFile, data);
    resource.setResourceScheme("storage");
    resource.setResourceUri(nodeFile.getPath());
    resource.setDownloadUri(nodeFile.getPath());
    return resource;
  }

  public  List<UploadResource> upload(
      ClientInfo client, String storagePath, List<UploadResource> resources, boolean deleteOrphan) {
    createDirectory(storagePath, false);
    Set<String> names = new HashSet<String>();
    for(UploadResource resource: resources) {
      String storeId = resource.getStoreId();
      String fileName = resource.getName();
      names.add(fileName);
      byte[] data = uploadService.load(storeId);
      SNode nodeFile = new SNode(fileName, storagePath + "/" + fileName, SNode.Type.File);
      saveContent(client, nodeFile, data);
      resource.setResourceScheme("storage");
      resource.setResourceUri(nodeFile.getPath());
      resource.setDownloadUri(nodeFile.getPath());
    }
    if(deleteOrphan) {
      deleteNotIn(client, storagePath, names);
    }
    return resources;
  }

  public  List<SNode> uploadDep(ClientInfo client, String storagePath, List<UploadResource> uploadResources) {
    createDirectory(storagePath, false);
    List<SNode> nodes = new ArrayList<>();
    for(UploadResource sel: uploadResources) {
      String storeId = sel.getStoreId();
      String fileName = sel.getName();
      byte[] data = uploadService.load(storeId);
      SNode nodeFile = new SNode(fileName, storagePath + "/" + fileName, SNode.Type.File);
      saveContent(client, nodeFile, data);
      sel.setResourceScheme("storage");
      sel.setResourceUri(nodeFile.getPath());
      nodes.add(nodeFile);
    }
    return nodes;
  }

  public <T extends EntityAttachment> List<T> saveAttachments(
      ClientInfo client, String storagePath, List<T> attachments, boolean deleteOrphan) {
    if(attachments == null) attachments = new ArrayList<>(); 
    Set<String> names = new HashSet<String>();
    for(EntityAttachment attachment : attachments) {
      names.add(attachment.getName());
      UploadResource uploadResource = attachment.getUploadResource();
      if(uploadResource == null) continue;
      uploadResource = upload(client, storagePath, uploadResource);
      attachment.withUploadResource(uploadResource);
    }
    if(deleteOrphan) deleteNotIn(client, storagePath, names);
    return attachments;
  }


  public Storage createStorage(ClientInfo client, String baseDir) {
    return new Storage(client, this, baseDir);
  }

  public UserStorage createUserStorage(ClientInfo client, String userId) {
    return new UserStorage(client, this, userId);
  }

  public CompanyStorage createCompanyStorage(ClientInfo client, String company) {
    return new CompanyStorage(client, this, company);
  }
  
  public int deleteNotIn(ClientInfo client, String path, Set<String> names) {
    String[] childrenNames = getSystemFileChildrenNames(path);
    int delCount = 0 ;
    for(String name : childrenNames) {
      if(!names.contains(name)) {
        deleteSystemFile(path + "/" + name);
        delCount++;
      }
    }
    return delCount;
  }


  public boolean deleteSystemDirOrFile(ClientInfo client, String path) {
    File file = new File(storageDir + path);
    if(!file.exists()) return true;
    try {
      if(file.isDirectory()) {
        FileUtil.emptyFolder(file, false);
      }
      FileUtil.remove(file, false);
    } catch (Exception e) {
      throw new RuntimeError(ErrorType.OperationNotAllow, "Cannot remove " + path, e);
    }
    return true;
  }

  boolean deleteSystemFile(String path) {
    File file = new File(storageDir + path);
    if(!file.exists()) return true;
    try {
      FileUtil.remove(file, false);
    } catch (Exception e) {
      throw new RuntimeError(ErrorType.OperationNotAllow, "Cannot remove " + path, e);
    }
    return true;
  }

  String[] getSystemFileChildrenNames(String path) {
    File file = new File(storageDir + path);
    if(!file.exists() || file.isFile()) return StringUtil.EMPTY_ARRAY;
    return file.list();
  }

  public boolean hasSNode(String path) {
    File file = new File(storageDir + path);
    return file.exists();
  }

  File ensureSystemFileExists(String path) {
    String filePath = storageDir + path;
    File file = new File(filePath);
    if(!file.exists()) {
      throw new RuntimeError(ErrorType.IllegalState, filePath + " is not existed!");
    }
    return file;
  }
  
  public SNode ensureNodeExists(String path) {
    File file = new File(storageDir + path);
    if(!file.exists()) {
      throw new RuntimeError(ErrorType.IllegalState, path + " is not existed!");
    } else if(!file.isFile()) {
      throw new RuntimeError(ErrorType.IllegalState, path + " is not a file!");
    }
    return new SNode(file.getName(), path, SNode.Type.File);
  }
  
  public SNode ensureNodeWritable(String path) {
    File file = new File(storageDir + path);
    if(!file.exists()) {
      File parent = file.getParentFile();
      if(!parent.exists()) {
        throw new RuntimeError(ErrorType.IllegalState, path + " is not writable!");
      }
    } else if(!file.isFile()) {
      throw new RuntimeError(ErrorType.IllegalState, path + " is not a file!");
    }
    return new SNode(file.getName(), path, SNode.Type.File);
  }
  

}
