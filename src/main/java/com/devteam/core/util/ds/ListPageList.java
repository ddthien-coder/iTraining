package com.devteam.core.util.ds;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ListPageList<T> extends PageList<T>{
  private List<T> list_ ;

  public ListPageList(int pageSize, List<T> list) {
    super(pageSize);
    list_ = list ;
    setAvailablePage(list.size()) ;
  }

  public ListPageList(int pageSize, T[] array) {
    super(pageSize);
    list_ = new ArrayList<T>(array.length) ;
    for(int i = 0; i < array.length; i++) list_.add(array[i]) ;
    setAvailablePage(array.length) ;
  }

  protected void populateCurrentPage(int page) throws Exception {
    currentListPage_ = list_.subList(getFrom(), getTo()) ;
  }

  public List<T> getAll() { return this.list_ ; }

  public void sort(Comparator<T> comparator) {
    Collections.sort(list_, comparator) ;
  }
}