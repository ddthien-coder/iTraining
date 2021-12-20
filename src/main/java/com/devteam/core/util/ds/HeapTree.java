package com.devteam.core.util.ds;

import java.util.Arrays;
import java.util.Comparator;

public class HeapTree<T> {
  final static public int NO_ORDER = 0 ;
  final static public int ASC_ORDER = 1 ;
  final static public int DESC_ORDER = 2 ;
 
  private int size ;
  private int maxSize ;
  private T[] node ;
  private Comparator<T> comparator ;

  public HeapTree(int maxSize, Comparator<T> comparator) {
    this.maxSize = maxSize ;
    this.comparator = comparator ;
    clear() ;
  }

  public int size() { return size ; }

  public int maxSize() { return maxSize ; }

  public T insert(T newNode) {
    if(size < maxSize) {
      node[size] = newNode ;
      shiftUp(size) ;
      size++ ;
      return null ;
    } else {
      if(comparator.compare(newNode, node[0]) < 0) {
        return newNode ;
      }
      T replacedNode = node[0] ;
      node[0] = newNode ;
      shiftDown(0) ;
      return replacedNode ;
    }
  }

  public T top() {
    if(size == 0) return null ;
    return node[0] ;
  }

  public T removeTop() {
    if(size == 0) return null ;
    T tmp = node[0] ;
    node[0]  = node[--size] ;
    node[size] = tmp ;
    shiftDown(0) ;
    return tmp ;
  }
  
  public T[] toArray(T[] array) {
    System.arraycopy(node, 0, array, 0, size) ;
    return array ;
  }

  public T[] toArray(T[] array, int order) {
    System.arraycopy(node, 0, array, 0, size) ;
    if(order == ASC_ORDER) {
      Arrays.sort(array, comparator) ;
    } else if(order == DESC_ORDER) {
      Arrays.sort(array, comparator) ;
      //reverse the order
      int i = 0, j = array.length - 1;
      while(i < j) {
        T tmp = array[i] ;
        array[i] = array[j] ;
        array[j] = tmp ;
        i++;
        j-- ;
      }
    }
    return array ;
  }

  public void clear() {
    node = (T[])new Object[maxSize] ;
    this.size = 0 ;
  }

  private void buildHeap() {
    for(int j = size/2 -1 ; j >= 0  ; j-- ) {
      shiftDown(j);
    }
  }

  public boolean isFull() { return size == maxSize ; }

  /**
   * Find the left child of a node in the heap tree
   * @param pos The index of the cell in the array
   **/
  public int leftChild(int pos ) { return 2*pos + 1; }
  /**
   * Find the right child of a node in the heap tree
   * @param pos The index of the cell in the array
   **/
  public int rightChild(int pos ) { return 2*pos + 2; }
  /**
   * Find the parent of a node in a heap tree
   * @param pos The index of the cell in the array
   **/
  public int parent(int pos) { return (pos -1) /2 ; }

  /**
   * Function to check whether a node is a leaf or internal node, use to
   * check a node in a heap tree
   * @param pos The index of the cell in the array
   **/
  public boolean isLeaf(int pos) {
    return ((pos >= size/2 ) && (pos < size) );
  }

  /**
   * This function will shiftdown a node until  it is a leaf node or it is
   * smaller then its both right and left child
   * @param keys the heap tree store in an array
   * @param n frequency of node in the array
   * @param pos index of the node in the array
   **/
  public void shiftDown(int pos) {
    if(pos < 0 || pos >= size) return ;
    while( !isLeaf(pos) ) {
      int j = leftChild(pos) ;
      if((j < size - 1)  && (comparator.compare(node[j], node[j + 1])  > 0)) j++;
      if(comparator.compare(node[pos], node[j])  < 0) return ;
      swap(pos, j);
      pos = j;
    }
  }

  private void shiftUp(int pos) {
    while(pos > 0) {
      int parent = parent(pos) ;
      if(comparator.compare(node[pos], node[parent]) > 0) return ;
      swap(parent, pos) ;
      pos = parent ;
    }
  }

  private void swap(int p1, int p2) {
    T temp = node[p1] ;
    node[p1] = node[p2] ;
    node[p2] = temp ;
  }

  public void printNodes() {
    for(int i =0; i < size; i++) {
      System.out.print(node[i]) ;
      System.out.print(" ") ;
    }

  }
}