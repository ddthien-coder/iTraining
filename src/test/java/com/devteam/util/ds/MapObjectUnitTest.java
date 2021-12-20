package com.devteam.util.ds;

import java.util.HashMap;
import java.util.Map;

import com.devteam.core.util.dataformat.DataSerializer;
import com.devteam.core.util.ds.MapObject;
import org.junit.jupiter.api.Test;


public class MapObjectUnitTest {
  @Test
  public void testSerializer() {
    Map<String, Object> map = new HashMap<>();
    map.put("String", "String");
    map.put("Double", 1.0d);
    map.put("Long", 5000000000L);
    
    String json = DataSerializer.JSON.toString(map);
    System.out.println(json);
    
    MapObject revertMap = DataSerializer.JSON.fromString(json, MapObject.class);
    
    for(Map.Entry<String, Object> entry : revertMap.entrySet()) {
      System.out.println(entry.getKey() + ": " + entry.getValue() + " - " + entry.getValue().getClass());
    }
  }
}
