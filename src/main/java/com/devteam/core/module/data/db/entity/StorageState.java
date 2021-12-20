package com.devteam.core.module.data.db.entity;

public enum StorageState { 
  CREATED, INACTIVE, JUNK, DEPRECATED, ACTIVE, ARCHIVED;
  
  static public StorageState[] ALL = StorageState.values(); 
}