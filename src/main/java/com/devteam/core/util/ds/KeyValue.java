package com.devteam.core.util.ds;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @Getter @Setter
public class KeyValue<Key, Value> {
  private String id;
  private Key    key; 
  private Value  value;

  public KeyValue(Key key, Value value) {
    this.key   = key;
    this.value = value;
  }
  
  public KeyValue(String id, Key key, Value value) {
    this.id    = id;
    this.key   = key;
    this.value = value;
  }
} 
