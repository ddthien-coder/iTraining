package com.ddthien.itraining.core.data.cache;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import javax.cache.Caching;

import org.ehcache.jsr107.EhcacheCachingProvider;
import org.ehcache.xml.XmlConfiguration;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.cache.jcache.JCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;

import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
@ComponentScan(basePackages = {
        "com.ddthien.itraining.core.data.cache"
}
)
@EnableCaching
public class CachingConfig {
    final static public String DISK_CACHE_MANAGER = "diskCacheManager";
    final static public String MEM_CACHE_MANAGER  = "memCacheManager";

    final static public String REGION_ENTITY  = "entity";
    final static public String REGION_GENERIC = "generic";


    private int timeToLiveInMin = 30;
    private int maxCacheSize    = 500;

    @Bean
    public Caffeine<Object, Object> caffeineConfig() {
        Caffeine<Object, Object> caffeine =
                Caffeine.newBuilder()
                        .expireAfterWrite(timeToLiveInMin, TimeUnit.MINUTES)
                        .initialCapacity(50)
                        .maximumSize(maxCacheSize)
                        .weakKeys()
                        .recordStats();
        return caffeine;
    }


    @Primary
    @Bean(MEM_CACHE_MANAGER)
    public CacheManager cacheManager(Caffeine<Object, Object> caffeine) {
        CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager();
        caffeineCacheManager.setCaffeine(caffeine);
        return caffeineCacheManager;
    }

    @Bean(DISK_CACHE_MANAGER)
    public CacheManager diskCacheManager(@Qualifier("ehCacheManager") javax.cache.CacheManager cacheManager) {
        JCacheCacheManager manager = new JCacheCacheManager(cacheManager);
        return manager;
    }

    @Bean(name="ehCacheManager", destroyMethod = "close")
    public javax.cache.CacheManager ehCacheManager(@Value("${app.env:#{null}}") String env) throws IOException {
        String configFile = "ehcache.xml";
        if("test".equals(env)) {
            configFile = "test-ehcache.xml";
        }
        XmlConfiguration xmlConfig = new XmlConfiguration(new ClassPathResource(configFile).getURL());
        EhcacheCachingProvider provider = (EhcacheCachingProvider) Caching.getCachingProvider();
        javax.cache.CacheManager manager = provider.getCacheManager(provider.getDefaultURI(), xmlConfig);
        return manager;
    }
}
