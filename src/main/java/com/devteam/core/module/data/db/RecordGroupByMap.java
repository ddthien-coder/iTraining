package com.devteam.core.module.data.db;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

public class RecordGroupByMap<Key, T>  {
  private Function<T, Key> getKeyFunc;
  private Map<Key, List<T>> map = new HashMap<>();
  
  
  public RecordGroupByMap(Function<T, Key>  func) {
    this.getKeyFunc = func;
  }

  public RecordGroupByMap(List<T> records, Function<T, Key>  func) {
    this.getKeyFunc = func;
    addAll(records);
  }
 
  public Map<Key, List<T>> getAll() { return map; }
  
  public List<T> get(Key key) {
    return map.get(key);
  }
  
  public RecordGroupByMap<Key, T> addAll(List<T> records) {
    for(int i = 0; i < records.size(); i++) {
      T record = records.get(i);
      Key key = getKeyFunc.apply(record);
      List<T> holder = map.get(key);
      if(holder == null) {
        holder = new ArrayList<T>();
        map.put(key, holder);
      }
      holder.add(record);
    }
    return this;
  }
}
