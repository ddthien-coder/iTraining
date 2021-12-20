package com.devteam.core.util.cache;

public interface Cache<T> {
  void add(String key, T value, long periodInMillis);
  void remove(String key);
  T get(String key);
  void clear();
  long size();
}