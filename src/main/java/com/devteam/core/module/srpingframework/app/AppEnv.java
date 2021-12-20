package com.devteam.core.module.srpingframework.app;

import java.util.HashSet;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.origin.OriginTrackedValue;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.EnumerablePropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.stereotype.Component;

import lombok.Getter;

@Component
public class AppEnv {
  @Autowired
  private Environment env;
  
  @Getter
  @Value("${app.home}")
  private String appHome;

  @Getter
  @Value("${app.instance.dir:#{null}}")
  private String appInstanceDir;

  @Getter
  @Value("${app.config.dir:#{null}}")
  private String appConfigDir;

  @Getter
  @Value("${app.storage.dir:#{null}}")
  private String dataDir;

  @Getter
  private String uploadDir;
  
  @Getter
  private String storageDir ;

  @Value("${app.addons:core}")
  private String addonsConfig ;

  @Getter
  private String addonsDir ;

  @Getter
  private Set<String> addons ;
  
  @PostConstruct
  public void onInit() throws Exception {
    if(appConfigDir == null) {
      appConfigDir = appHome + "/config" ;
    }
    if(uploadDir == null) {
      uploadDir = appHome + "/upload" ;
    }
    
    if(dataDir == null) {
      dataDir = appHome + "/data" ;
    }

    storageDir = dataDir + "/storage" ;
    uploadDir = dataDir + "/upload" ;

    if(addonsDir == null) {
      addonsDir = appHome + "/addons" ;
    }

    addons = new HashSet<>();
    String[] tokens = addonsConfig.trim().split(",");
    for(String sel : tokens) {
      addons.add(sel);
    }
  }
  
  public String fileResourcePath(String relativePath) {
    String appHome = this.appHome.replace('\\', '/');
    if(appHome.startsWith("/")) {
      return "file:" + appHome + "/" + relativePath;
    }
    return "file:/" + appHome + "/" + relativePath;
  }
  
  public String filePath(String relativePath) {
    return appHome + "/" + relativePath;
  }
  
  
  public String addonResourcePath(String addon, String relativePath) {
    String addonDir = this.addonsDir.replace('\\', '/') + "/" + addon;
    if(addonDir.startsWith("/")) {
      return "file:" + addonDir + "/" + relativePath;
    }
    return "file:/" + addonDir + "/" + relativePath;
  }
  
  public String addonPath(String addon, String relativePath) {
    String addonDir = this.addonsDir.replace('\\', '/') + "/" + addon;
    if(addonDir.startsWith("/")) {
      return addonDir + "/" + relativePath;
    }
    return addonDir + "/" + relativePath;
  }

  public SortedMap<String, Object> getPropertiesWithPrefix(String keyPrefix) {
    Set<String> keySet = new HashSet<>();
    if (env instanceof ConfigurableEnvironment) {
      ConfigurableEnvironment envImpl = (ConfigurableEnvironment) env; 
      for (PropertySource<?> propertySource : envImpl.getPropertySources()) {
        if (propertySource instanceof MapPropertySource) {
          var mapProperties = ((MapPropertySource) propertySource).getSource();
          mapProperties.forEach((key, value) -> {
            if (key.startsWith(keyPrefix)) {
              keySet.add(key);
            }
          });
        }
      }
    }
    SortedMap<String, Object> holder = new TreeMap<>();
    for(String key : keySet) {
      String val = env.getProperty(key);
      holder.put(key, val);
    }
    return holder;
  }
}
