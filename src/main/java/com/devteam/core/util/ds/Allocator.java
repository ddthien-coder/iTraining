package com.devteam.core.util.ds;

import java.util.Random;

abstract public class Allocator<T> {
  abstract public T next() ;
  abstract public T[] next(T[] holder) ;
  abstract public T[] getItems() ;
  abstract public int available() ;

  public boolean hasItem(T object) {
    return isIn(object, getItems()) ;
  }
  
  protected boolean isIn(T object, T[] objects) {
    if(objects == null) return false ;
    for(int i = 0; i < objects.length; i++) {
      if(object.equals(objects[i])) return true ;
    }
    return false ;
  }
  
  static public class RoundRobinAllocator<T> extends Allocator<T> {
    private Iterator<T>   iterator ;
    
    public RoundRobinAllocator(T[] items) {
      this.iterator = new Iterator<T>(items) ;
    }
    
    public T next() { return iterator.next() ; }

    public T[] next(T[] holder) {
      if(holder.length > iterator.items.length) {
        throw new RuntimeException("The request item is bigger than the available items") ;
      }
      for(int i = 0; i < holder.length; i++) holder[i] = iterator.next() ;
      return holder ;
    }
    
    public T[] getItems() { return this.iterator.items ; }
    
    public int available() { return this.iterator.items.length ; }
    
    static public class Iterator<T> {
      T[] items ;
      int pos ;
      
      Iterator(T[] available) {
        this.items = available ;
        this.pos = 0 ;
      }
      
      public T next() {
        T ret = items[pos++] ;
        if(pos == this.items.length) pos = 0;
        return ret ;
      }
    }
  }
  
  
  static public class RandomAllocator<T> extends Allocator<T> {
    T[] items;
    Random seed = new Random();


    public RandomAllocator(T[] items) {
      this.items = items;
    }

    public T next() { return items[seed.nextInt(items.length)] ; }

    public T[] next(T[] holder) {
      if(holder.length > items.length) {
        throw new RuntimeException("The request item is bigger than the available items") ;
      }
      for(int i = 0; i < holder.length; i++) holder[i] = next() ;
      return holder ;
    }

    public T[] getItems() { return items ; }

    public int available() { return items.length ; }
  }
}