package com.ddthien.itraining.core.data.cache;

import java.lang.ref.SoftReference;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

public class InMemoryCache<T> implements Cache<T> {
    private static final int CLEAN_UP_PERIOD_IN_SEC = 5;

    private static AtomicLong    idTracker = new AtomicLong();
    private static CleanerThread CLEANER_THREAD = new CleanerThread();

    static {
        CLEANER_THREAD.setDaemon(true);
        CLEANER_THREAD.start();
    }

    private Long   id;
    private final ConcurrentHashMap<String, SoftReference<CacheObject<T>>> cache = new ConcurrentHashMap<>();

    public InMemoryCache() {
        id = idTracker.getAndIncrement();
        CLEANER_THREAD.add(this);
    }

    @Override
    public void add(String key, T value, long periodInMillis) {
        if (key == null)  throw new IllegalArgumentException("Key cannot be null");

        if (value == null) {
            cache.remove(key);
        } else {
            long expiryTime = System.currentTimeMillis() + periodInMillis;
            cache.put(key, new SoftReference<CacheObject<T>>(new CacheObject<T>(value, expiryTime)));
        }
    }

    @Override
    public void remove(String key) {
        cache.remove(key);
    }

    @Override
    public T get(String key) {
        SoftReference<CacheObject<T>> value = cache.get(key);
        if(value == null) return null;
        CacheObject<T> cacheObject = value.get();
        if(cacheObject != null && !cacheObject.isExpired()) {
            T obj = cacheObject.value;
            return obj;
        }
        cache.remove(key);
        return null;
    }

    @Override
    public void clear() {
        cache.clear();
    }

    @Override
    public long size() {
        long count = 0;
        Iterator<SoftReference<CacheObject<T>>> i = cache.values().iterator();
        while(i.hasNext()) {
            SoftReference<CacheObject<T>> value = i.next();
            if(value != null) {
                CacheObject<T> cacheObject = value.get();
                if(!cacheObject.isExpired()) {
                    count++;
                }
            } else {
                i.remove();
            }
        }
        return count;
    }

    public void clean() {
        Iterator<SoftReference<CacheObject<T>>> i = cache.values().iterator();
        while(i.hasNext()) {
            SoftReference<CacheObject<T>> value = i.next();
            if(value != null) {
                CacheObject<T> cacheObject = value.get();
                if(cacheObject.isExpired()) {
                    i.remove();
                }
            }
        }
    }

    @Override
    public void finalize() {
        CLEANER_THREAD.remove(this);
    }

    static class CacheObject<T> {
        T value;
        long expiryTime;

        public CacheObject(T value, long expiryTime) {
            this.value = value;
            this.expiryTime = expiryTime;
        }

        boolean isExpired() { return System.currentTimeMillis() > expiryTime; }
    }

    static public class CleanerThread extends Thread {
        Map<Long, InMemoryCache<?>> cacheInstaces = new ConcurrentHashMap<>();

        public void add(InMemoryCache<?> instance) {
            cacheInstaces.put(instance.id, instance);
        }

        public void remove(InMemoryCache<?> instance) {
            cacheInstaces.remove(instance.id);
        }

        public void run() {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    Thread.sleep(CLEAN_UP_PERIOD_IN_SEC * 1000);
                    for(InMemoryCache<?> cache : cacheInstaces.values()) cache.clean();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }
}
