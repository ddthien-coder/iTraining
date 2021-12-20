package com.devteam.core.util.ds;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

public class MapList<T> {
  
  private Map<String, List<T>> map = new HashMap<>();
  
  public List<T> get(String key) {
    return map.get(key);
  }
  
  public void add(String key, T entity) {
    List<T> holder = map.get(key);
    if(holder == null) {
      holder = new ArrayList<>();
      map.put(key, holder);
    }
    holder.add(entity);
  }
  
  public Set<String> getKeys() { return map.keySet(); }

  public void groupBy(List<T> list, Function<T, String> func) {
    for(T sel : list) {
      String key = func.apply(sel) ;
      add(key, sel);
    }
  }
}
