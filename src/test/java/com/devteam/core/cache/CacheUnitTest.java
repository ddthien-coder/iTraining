package com.devteam.core.cache;

import java.io.Serializable;

import com.devteam.util.TestConfig;
import com.devteam.core.module.data.cache.CachingConfig;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;


public class CacheUnitTest extends TestConfig {
  @Autowired
  MemTestCacheService memTestservice;

  @Autowired
  DiskTestCacheService diskTestservice;

  @Autowired
  @Qualifier("diskCacheManager")
  CacheManager diskCacheManager;
  
  @Test @Tag("unit")
  public void testMemCache() {
    System.out.println("\n-----------------------------------------------------");
    System.out.println("Mem Cache Service");
    System.out.println("-----------------------------------------------------");
    MemTestCacheService service = memTestservice;
    Assertions.assertEquals("first", service.getByKey("first", "first"));
    Assertions.assertEquals("first", service.getByKey("first", "second"));
    Assertions.assertEquals("first", service.getByCustomKey(new CustomKey("first"), "first"));
    service.evictKey("first");
    Assertions.assertEquals("second", service.getByCustomKey(new CustomKey("first"), "second"));

    System.out.println("Domain1 CustomKey: first call " + service.domain1GetCustomKey(new CustomKey("first"), "domain first"));
    System.out.println("Domain1 CustomKey: first call " + service.domain1GetCustomKey(new CustomKey("first"), "domain second"));

    System.out.println("Domain2 CustomKey: first call " + service.domain2GetCustomKey(new CustomKey("first"), "domain first"));
    System.out.println("Domain2 CustomKey: first call " + service.domain2GetCustomKey(new CustomKey("first"), "domain second"));

    System.out.println("-----------------------------------------------------\n");
  }
  
  @Test @Tag("unit")
  public void testDiskCache() {
    System.out.println("\n-----------------------------------------------------");
    System.out.println("Disk Cache Test");
    System.out.println("-----------------------------------------------------");
    DiskTestCacheService service = this.diskTestservice;
    Assertions.assertEquals("first", service.getByKey("first", "first"));
    Assertions.assertEquals("first", service.getByKey("first", "second"));
    Assertions.assertEquals("first",  service.getByCustomKey(new CustomKey("first"), "third"));
    service.evictKey("first");
    Assertions.assertEquals("second", service.getByKey("first", "second"));

    System.out.println("Domain1 CustomKey: first call " + service.domain1GetCustomKey(new CustomKey("first"), "domain first"));
    System.out.println("Domain1 CustomKey: first call " + service.domain1GetCustomKey(new CustomKey("first"), "domain second"));

    System.out.println("Domain2 CustomKey: first call " + service.domain2GetCustomKey(new CustomKey("first"), "domain first"));
    System.out.println("Domain2 CustomKey: first call " + service.domain2GetCustomKey(new CustomKey("first"), "domain second"));

    System.out.println("-----------------------------------------------------\n");
    
    Cache cache = diskCacheManager.getCache("generic");
    System.out.println("Cache Type = " + cache.getClass());
    
    for(int i =  0; i < 100; i++) {
      //cache.put("test-" + i, new byte[1024 * 100]);
      diskTestservice.domain1GetCustomKey(new CustomKey("key-" + i), new byte[1024 * 100]);
      diskTestservice.domain2GetCustomKey(new CustomKey("key-" + i), new byte[1024 * 100]);
    }
  }

  static public class CustomKey {
    private String customKey;
    
    public CustomKey(String key) {
      this.customKey = key;
    }
    
    public String getCustomKey() { return this.customKey; }
  }
  
  @Service("MemDiskCacheService")
  @CacheConfig(cacheManager= CachingConfig.MEM_CACHE_MANAGER, cacheNames = { "generic", "domain1", "domain2" })
  static public class MemTestCacheService {
    @Cacheable(value = "generic", key="#key")
    public String getByKey(String key, String value) {
      System.out.println("--> call getByKey(...)");
      return value;
    }

    @CacheEvict(value = "generic", key="#key")
    public void evictKey(String key) {
      System.out.println("Evict Key " + key);
    }

    @Cacheable(value = "generic", key="#key.customKey")
    public String getByCustomKey(CustomKey key, String value) {
      System.out.println("--> call getByCustomgKey(...)");
      return value;
    }

    @Cacheable(value = "domain1", key="{'prefix', #key.customKey}")
    public Serializable domain1GetCustomKey(CustomKey key, Serializable value) {
      System.out.println("--> call domain1GetCustomKey(...)");
      return value;
    }

    @Cacheable(value = "domain2", key="{'prefix', #key.customKey}")
    public Serializable domain2GetCustomKey(CustomKey key, Serializable value) {
      System.out.println("--> call domain2GetCustomKey(...)");
      return value;
    }
  }

  @Service("TestDiskCacheService")
  @CacheConfig(cacheManager= CachingConfig.DISK_CACHE_MANAGER, cacheNames = { "generic", "domain1", "domain2" })
  static public class DiskTestCacheService {
    @Cacheable(value = "generic", key="#key")
    public String getByKey(String key, String value) {
      System.out.println("--> call getByKey(...), value = " + value);
      return value;
    }

    @CacheEvict(value = "generic", key="#key")
    public void evictKey(String key) {
      System.out.println("Evict Key " + key);
    }

    @Cacheable(value = "generic", key="#key.customKey")
    public String getByCustomKey(CustomKey key, String value) {
      System.out.println("--> call getByCustomgKey(...)");
      return value;
    }

    @Cacheable(value = "domain1", key="{'prefix', #key.customKey}")
    public Serializable domain1GetCustomKey(CustomKey key, Serializable value) {
      System.out.println("--> call domain1GetCustomKey(...)");
      return value;
    }

    @Cacheable(value = "domain2", key="{'prefix', #key.customKey}")
    public Serializable domain2GetCustomKey(CustomKey key, Serializable value) {
      System.out.println("--> call domain2GetCustomKey(...)");
      return value;
    }
  }

}
