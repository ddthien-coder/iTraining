package com.devteam.core.module.data.db.entity;

import java.util.List;

import com.devteam.core.util.ds.Objects;
import com.devteam.core.util.text.StringUtil;
import lombok.Getter;

public class IDPath {
  @Getter
  private String   path;
  @Getter
  private String   parentPath;
  @Getter
  private String[] ancestorPath;

  @Getter
  private String[] owners;
  
  @Getter
  private String  id;
  
  public IDPath(String path) {
    Objects.assertNotNull(path, "Path cannot be null");
    this.path = path;
    String idPath = path;
    String ownerPath = null;
    int idPathSeparator = path.lastIndexOf(':');
    if(idPathSeparator > 0) {
      ownerPath = path.substring(0, idPathSeparator);
      idPath = path.substring(idPathSeparator + 1);
      List<String> token = StringUtil.split(ownerPath, ':');
      owners = new String[token.size()];
      for(int i = 0; i < owners.length; i++) {
        owners[i] = token.get(i);
      }
    }

    List<String> pathToken = StringUtil.split(idPath, '/');
    if(pathToken.size() > 1) {
      ancestorPath = new String[pathToken.size() - 1];
      String aPath = "";
      if(ownerPath != null) aPath = ownerPath + ":" ;
      for(int i = 0; i < ancestorPath.length; i++) {
        aPath += "/" + pathToken.get(i);
        ancestorPath[i] = aPath;
      }
      parentPath = aPath;
    }
    id = pathToken.get(pathToken.size() - 1);
  }
  
  public Long getIdAsLong() { 
    if(id == null) return null;
    return Long.parseLong(id);
  }
  
  static public String createPath(String idPath, Long id) {
    Objects.assertNotNull(id, "Id cannot be null");
    if(idPath == null) return "/" + id;
    return idPath + "/" + id;
  }

  static public String createPath(String idPath, Persistable<?> entity) {
    // project[id]:subproject[id]:/id 
    if(idPath == null) return "/" + entity.getId();
    return idPath + "/" + entity.getId();
  }
}
