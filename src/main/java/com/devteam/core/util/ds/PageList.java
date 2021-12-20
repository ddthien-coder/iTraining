package com.devteam.core.util.ds;

import java.util.Comparator;
import java.util.List;

import lombok.Getter;

abstract public class PageList<T> {
  
  private int pageSize_ ;
  protected int available_ = 0;
  protected int availablePage_  = 1;
  protected int currentPage_ = -1 ;
  protected List<T> currentListPage_ ;
  
  public PageList(int pageSize) {
    pageSize_ = pageSize ;
  }
  
  public int getPageSize() { return pageSize_  ; }
  public void setPageSize(int pageSize) {
    pageSize_ = pageSize ;
    setAvailablePage(available_) ;
  }
  
  public int getCurrentPage() { return currentPage_ ; }
  public int getAvailable() { return available_ ; }
  
  public int getAvailablePage() { return availablePage_ ; }
  
  public List<T> currentPage() throws Exception {
    if(currentListPage_ == null) {
      populateCurrentPage(currentPage_) ;
    }
    return currentListPage_  ;
  }
  
  public void setCurrentPage(int page, List<T> pages) { 
    currentListPage_ =  pages ; 
  }
  
  abstract protected void populateCurrentPage(int page) throws Exception   ;
  
  public List<T> getPage(int page) throws Exception   {
    checkAndSetPage(page) ;
    populateCurrentPage(page) ;
    return currentListPage_ ;
  }
  
  protected void checkAndSetPage(int page) throws Exception  {
    if(page < 1 || page > availablePage_) {
      throw new Exception("Page is out of range " + page) ;
    }
    currentPage_ =  page ;
  }
  
  protected void setAvailablePage(int available) {
    available_ = available ;
    if (available == 0)  {
      availablePage_ = 1 ; 
      currentPage_ =  1 ;
    } else {
      int pages = available / pageSize_ ;
      if ( available % pageSize_ > 0) pages++ ;
      availablePage_ = pages ;
      currentPage_ =  1 ;
    }
  }
  
  public int getFrom() { 
    return (currentPage_ - 1) * pageSize_ ; 
  }
  
  public int getTo() { 
    int to = currentPage_  * pageSize_ ; 
    if (to > available_ ) to = available_ ;
    return to ;
  }
  
  public int[] getSubRange(int page, int rangeSize) {
    if(page < 1 || page > availablePage_) {
      throw new RuntimeException("page " + page + " is out of range") ; 
    }
    int[] range = new int[2];
    if(rangeSize >= availablePage_) {
      range[0] = 1 ;
      range[1] = availablePage_ ;
      return range ;
    }
    
    int half = rangeSize/2 ;
    if(page - half < 1) {
      range[0] = 1 ;
      range[1] = rangeSize ;
    } else if(page + (rangeSize - half) > availablePage_) {
      range[0] = availablePage_ -  rangeSize ;
      range[1] = availablePage_ ;
    } else {
      range[0] = page - half;
      range[1] = page + (rangeSize - half) ;
    }
    return  range ;
  }
  
  public PageListSubRange<T> subrange(int page, int rangeSize) {
    int[] range = this.getSubRange(page, rangeSize);
    return new PageListSubRange<T>(this, page, range[0],range[1]);
  }
  
  public void sort(Comparator<T> comparator) {
  	throw new RuntimeException("This method is not supported");
  }
  
  static public class PageListSubRange<T> {
    @Getter
    PageList<T> pageList;
    
    @Getter
    int      selectPage;
    
    @Getter
    int      from ;
    
    @Getter
    int      to   ;
    
    PageListSubRange(PageList<T> pl, int selectPage, int from, int to) {
      this.pageList   = pl;
      this.selectPage = selectPage;
      this.from       = from;
      this.to         = to;
    }
    
    public List<T> getSelectPageData() throws Exception {
      return pageList.getPage(selectPage);
    }
  }
}