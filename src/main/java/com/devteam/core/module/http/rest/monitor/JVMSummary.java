package com.devteam.core.module.http.rest.monitor;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class JVMSummary {
  @Getter @Setter
  private String         name;
  
  @Getter @Setter
  private String         description;
  
  @Getter @Setter
  private List<Property> properties;

  public void addProperty(String name, Object value) {
    if (properties == null) this.properties = new ArrayList<Property>();
    properties.add(new Property(name, value));
  }

  static public class Property {
    @Getter
    private String name;
    
    @Getter @Setter
    private Object value;

    public Property() { } 
    
    public Property(String name, Object value) {
      this.name = name;
      this.value = value ;
    }
  }
}
