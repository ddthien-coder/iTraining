package com.devteam.module.storage;

import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor @Getter @Setter
public class SNode {
  static public enum Type { File, Directory }
  private String name;
  private String path;
  private Type   type ;
  private long   size;
  private Date   createdTime;
  private String createdBy;
  private Date   modifiedTime;
  private String modifiedBy;
  
  private List<SNode> children;
  
  public SNode(String name, String path, Type type) {
    this.name = name;
    this.path = path;
    this.type = type;
    
  }

  public void setSize(long size) {
    this.size = size;
  }
}
