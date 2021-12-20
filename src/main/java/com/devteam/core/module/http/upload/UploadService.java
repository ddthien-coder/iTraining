package com.devteam.core.module.http.upload;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

import com.devteam.core.module.data.cache.CachingConfig;
import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;
import com.devteam.core.util.io.IOUtil;
import com.devteam.core.util.text.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.Cache;
import org.springframework.cache.Cache.ValueWrapper;
import org.springframework.cache.CacheManager;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadService {
  private Cache uploadCache;
  
  public UploadService(
      @Autowired @Qualifier(CachingConfig.DISK_CACHE_MANAGER) CacheManager diskCacheManager) {
    uploadCache = diskCacheManager.getCache("generic");
  }
  
  
  public UploadResource save(MultipartFile file, String baseDownloadUri, String baseResourceUri) {
    String fileName = StringUtils.cleanPath(file.getOriginalFilename());
    try {
      if(fileName.contains("..")) {
        throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
      }
      String storeId = DateUtil.asCompactDateTimeId(new Date()) + "-" + fileName ;
      store(storeId, file.getInputStream());
      return 
          new UploadResource(storeId, fileName, file.getContentType(), file.getSize())
          .withResourceUri(baseResourceUri + "/" + storeId)
          .withDownloadUri(baseResourceUri + "/" + storeId);
    } catch (IOException ex) {
      throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
    }
  }

  public UploadResource save(String baseDownloadUri, String baseResourceUri, File file) {
    String fileName = file.getName();
    try {
      if(fileName.contains("..")) {
        throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
      }
      String storeId = DateUtil.asCompactDateTimeId(new Date()) + "-" + fileName ;
      store(storeId, new FileInputStream(file));
      
      return 
          new UploadResource(storeId, fileName, "application/bin", file.length())
          .withResourceUri(baseResourceUri + "/" + storeId)
          .withDownloadUri(baseResourceUri + "/" + storeId);
    } catch (IOException ex) {
      throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
    }
  }

  public UploadResource save(String fileName, InputStream is) {
    if(fileName.contains("..")) {
      throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
    }
    String storeId = DateUtil.asCompactDateTimeId(new Date()) + "-" + fileName ;
    byte[] data = store(storeId, is);

    return 
        new UploadResource(storeId, fileName, "application/bin", data.length)
        .withResourceUri(storeId)
        .withDownloadUri(storeId);
  }
  
  public Resource loadAsResource(String storeId) {
    return new ByteArrayResource(load(storeId)); 
  }
  
  public byte[] load(String storeId) {
    //Path targetLocation = storageLocation.resolve(storeId).normalize();
    try {
      ValueWrapper valWrapper =  uploadCache.get(cacheKey(storeId));
      byte[] bytes = (byte[]) valWrapper.get();
      if(bytes == null) {
        throw new RuntimeError(ErrorType.Unknown, "No data available, maybe data is expired for " + storeId);
      }
      //byte[] bytes = IOUtil.getFileContentAsBytes(targetLocation.toFile());
      return bytes;
    } catch (Exception e) {
      throw new RuntimeError(ErrorType.Unknown, "Cannot read the upload resource " + storeId, e);
    }
  }
  
  private byte[] store(String storeId, InputStream is) {
    byte[] data = IOUtil.getStreamContentAsBytes(is);
    uploadCache.put(cacheKey(storeId), data);
    return data;
  }
  
  private String cacheKey(String storeId) { return "fileupload:" + storeId ; }
  
  @ResponseStatus(HttpStatus.NOT_FOUND)
  static public class MyFileNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public MyFileNotFoundException(String message) {
      super(message);
    }

    public MyFileNotFoundException(String message, Throwable cause) {
      super(message, cause);
    }
  }
}
