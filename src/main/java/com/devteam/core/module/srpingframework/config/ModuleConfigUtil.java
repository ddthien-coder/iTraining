package com.devteam.core.module.srpingframework.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;

import com.google.common.reflect.ClassPath;


public class ModuleConfigUtil {
  static public String[] getModuleConfigBasePackages(Environment environment) {
    List<ModuleConfig> configs = getModuleConfigs(environment);
    Set<String> set = new HashSet<>();
    for(ModuleConfig config : configs) {
      for(String basePkg : config.basePackages()) {
        set.add(basePkg);
      }
    }
    return set.toArray(new String[set.size()]);
  }
  
  static public List<ModuleConfig> getModuleConfigs(Environment environment) {
    List<ModuleConfig> configs = new ArrayList<>();
    Set<Class<?>> classes = findClassesInPackage("net.datatp.module.config");
    for(Class<?> clazz : classes) {
      Profile profile = clazz.getAnnotation(Profile.class);
      if(profile != null) {
        String[] names = profile.value();
        Profiles profiles = Profiles.of(names);
        if(!environment.acceptsProfiles(profiles)) continue;
      }
      ModuleConfig config = clazz.getAnnotation(ModuleConfig.class) ;
      if(config != null) configs.add(config);
    }
    return configs;
  }

  static public Set<Class<?>> findClassesInPackage(String  ... packages) {
    try {
      Set<Class<?>> allClasses = new HashSet<>();
      for(String packageName : packages) {
        Set<Class<?>> classes = ClassPath.from(ClassLoader.getSystemClassLoader())
            .getAllClasses()
            .stream()
            .filter(clazz -> clazz.getPackageName().equalsIgnoreCase(packageName))
            .map(clazz -> clazz.load())
            .collect(Collectors.toSet());
        allClasses.addAll(classes);
      }
      return allClasses;
    } catch (IOException e) {
      throw new RuntimeError(ErrorType.Unknown, "Cannot find classes");
    }
  }
}
