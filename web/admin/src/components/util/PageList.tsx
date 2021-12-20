export default class PageList {
  pageSize:      number;
  available:     number = -1;
  availablePage: number = -1;
  currentPage:   number = 1;

  list:            Array<any> = [];
  currentListPage: Array<any>|null = null;

  constructor(pageSize: number, list: Array<any>) {
    this.pageSize = pageSize;
    this.setList(list);
  }

  setList(list: Array<any>) {
    this.list = list ;
    this.available = list.length;
    let selCurrentPage = this.currentPage;
    this.setAvailablePage(list.length) ;
    if(selCurrentPage > this.availablePage) selCurrentPage = 1;
    this.getPage(selCurrentPage);
  }

  getPageSize() : number { return this.pageSize; }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize ;
    this.setAvailablePage(this.available) ;
  }

  getCurrentPage() { return this.currentPage ; }

  getAvailable() { return this.available ; }

  getAvailablePage() { return this.availablePage ; }

  getDataList() { return this.list ; }

  getPrevPage() {
    if(this.currentPage === 1) return 1 ;
    return this.currentPage - 1 ;
  }

  getNextPage() {
    if(this.currentPage === this.availablePage) return this.currentPage ;
    return this.currentPage + 1 ;
  }

  getItemInPage(idx: number) {
    let items = this.currentPageItems();
    return items[idx];
  }

  currentPageItems() : Array<any> {
    if(this.currentListPage == null) {
      this.populateCurrentPage() ;
    }
    if(!this.currentListPage) {
      throw new Error('There is an error, the page items should not be null');
    }
    return this.currentListPage  ;
  }

  getPage(page: number) {
    this.checkAndSetPage(page) ;
    this.populateCurrentPage() ;
    return this.currentListPage ;
  }

  checkAndSetPage(page: number) {
    if(page < 1 || page > this.availablePage) {
      throw new Error("Page is out of range " + page) ;
    }
    this.currentPage =  page ;
  }

  setAvailablePage(available: number) {
    this.available = available ;
    if (available === 0)  {
      this.availablePage = 1 ;
      this.currentPage =  1 ;
    } else {
      var pages = Math.ceil(available / this.pageSize) ;
      this.availablePage = pages ;
      this.currentPage =  1 ;
    }
    this.currentListPage = null ;
  }

  getFrom() {
    return (this.currentPage - 1) * this.pageSize ;
  }

  getTo() {
    var to = this.currentPage * this.pageSize ;
    if (to > this.available ) to = this.available ;
    return to ;
  }

  computeRowIndexOf(page: number, rowInPage: number) {
    return (page - 1) * this.pageSize + rowInPage ;
  }

  getItemOnCurrentPage(idx: number) {
    if(!this.currentListPage) {
      throw new Error('There is no item in the current page');
    }
    return this.currentListPage[idx] ;
  }

  removeItemOnCurrentPage(idx: number) {
    var from = this.getFrom() ;
    var realIdx = from + idx ;
    var cpage = this.getCurrentPage() ;
    this.list.splice(realIdx, 1);
    this.setAvailablePage(this.list.length) ;
    if(this.getAvailablePage() < cpage) cpage = this.getAvailablePage() ;
    this.getPage(cpage) ;
  }

  getSubRange(page: number, rangeSize: number): Array<number> {
    if(page < 1 || page > this.availablePage) {
      throw new Error("page " + page + " is out of range") ;
    }
    var range = [];
    if(rangeSize >= this.availablePage) {
      range[0] = 1 ;
      range[1] = this.availablePage ;
      return range ;
    }

    var half = rangeSize/2 ;
    if(page - half < 1) {
      range[0] = 1 ;
      range[1] = rangeSize ;
    } else if(page + (rangeSize - half) > this.availablePage) {
      range[0] = this.availablePage -  rangeSize ;
      range[1] = this.availablePage ;
    } else {
      range[0] = page - half;
      range[1] = page + (rangeSize - half) ;
    }
    return  range ;
  }

  populateCurrentPage() {
    this.currentListPage = this.list.slice(this.getFrom(), this.getTo()) ;
  }
}
