package com.devteam.core.util.stat;

import java.util.Iterator;
import java.util.TreeMap;

public class Statistic extends TreeMap<String, StatisticEntry> {
  private static final long serialVersionUID = 1L;

  private String name ;

  public Statistic(String name) {
    this.name = name ;
  }

  public String getName() { return this.name ; }

  public void incr(String name, String relateTo, long amount) {
    if(name == null || name.length() == 0) name = "other" ;
    StatisticEntry value = get(name) ;
    if(value == null) put(name, new StatisticEntry(name, relateTo, amount)) ;
    else value.incr(amount) ;
  }

  public void incr(String[] name, long amount) {
    if(name == null || name.length == 0) {
      incr((String) null, null, amount) ;
      return ;
    } else {
      for(int i = 0; i < name.length; i++) {
        incr(name[i], null, amount) ;
      }
    }
  }

  public void incr(String[] name, String relateTo, long amount) {
    if(name == null || name.length == 0) {
      incr((String) null, relateTo, amount) ;
      return ;
    } else {
      for(int i = 0; i < name.length; i++) {
        incr(name[i], relateTo, amount) ;
      }
    }
  }

  public void traverse(StatisticVisitor visitor) {
    Iterator<StatisticEntry> i = values().iterator() ;
    while(i.hasNext()) visitor.onVisit(this, i.next()) ;
  }
}