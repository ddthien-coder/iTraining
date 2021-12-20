package com.devteam.core.util.ds;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.devteam.core.util.ds.Objects.Apply;
import com.devteam.core.util.ds.Objects.Selector;
import com.devteam.core.util.ds.Objects.Transformer;
import com.devteam.core.util.ds.Objects.Validator;
import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;

public class Collections {
  static public <T> void assertNotEmpty(Collection<T> collection) {
    assertNotEmpty(collection, "Collection is null or empty");
  }

  static public <T> void assertNotEmpty(Collection<T> col, String message) {
    if(col == null || col.size() == 0) {
      throw new RuntimeError(ErrorType.IllegalArgument, message);
    }
  }

  static public <T> boolean isEmpty(Collection<T> collection) {
    if(collection == null || collection.size() == 0) return true;
    return false;
  }

  static public <T> boolean isNotEmpty(Collection<T> collection) {
    return !isEmpty(collection);
  }

  static public <T> List<T> addToList(List<T> list, Collection<T> collection) {
    if(isEmpty(collection)) return list;
    if(list == null) list = new ArrayList<T>();
    list.addAll(collection);
    return list;
  }
  
  static public <T> List<T> toList(Collection<T> collection) {
    List<T> list = new ArrayList<>();
    if(collection != null) list.addAll(collection);
    return list;
  }
  
  static public <T> List<T> toList(Map<?, T> map) {
    List<T> list = new ArrayList<>();
    if(map != null) list.addAll(map.values());
    return list;
  }

  static public <T> T removeFirst(Collection<T> collection, Selector<T> selector) {
    if(isEmpty(collection)) return null;
    Iterator<T> i = collection.iterator();
    while(i.hasNext()) {
      T sel = i.next();
      if(selector.select(sel)) {
        i.remove();
        return sel;
      }
    }
    return null;
  }

  static public <T> Collection<T> remove(Collection<T> collection, Selector<T> selector) {
    if(isEmpty(collection)) return null;
    Iterator<T> i = collection.iterator();
    while(i.hasNext()) {
      T sel = i.next();
      if(selector.select(sel)) {
        i.remove();
      }
    }
    return collection;
  }

  static public <T> T findFirst(Collection<T> collection, Selector<T> selector) {
    if(isEmpty(collection)) return null;
    for(T sel : collection) if(selector.select(sel)) return sel;
    return null;
  }

  static public <T> List<T> find(Collection<T> collection, Selector<T> selector) {
    List<T> holder = new ArrayList<>();
    if(isEmpty(collection)) return holder;
    for(T sel : collection) if(selector.select(sel)) holder.add(sel);
    return holder;
  }

  static public <T> List<T> joinOuter(Collection<T> col1, Collection<T> col2, Comparator<T> comparator) {
    List<T> holder = new ArrayList<>();
    if(isEmpty(col1) && isEmpty(col2)) return holder;
    if(isEmpty(col1)) {
      holder.addAll(col2);
      return holder;
    }
    if(isEmpty(col2)) {
      holder.addAll(col1);
      return holder;
    }
    holder.addAll(col1);
    for(T rec2 : col2) {
      boolean added = false;
      for(T rec1 : col1) {
        if(comparator.compare(rec2, rec1) == 0) {
          added = true;
          break;
        }
      }
      if(!added) holder.add(rec2);
    }
    return holder;
  }

  static public <T> List<T> joinInner(Collection<T> col1, Collection<T> col2, Comparator<T> comparator) {
    List<T> holder = new ArrayList<>();
    if(isEmpty(col1) || isEmpty(col2)) return holder;
    for(T rec1 : col1) {
      boolean match = false;
      for(T rec2 : col2) {
        if(comparator.compare(rec1, rec2) == 0) {
          match = true;
          break;
        }
      }
      if(match) holder.add(rec1);
    }
    return holder;
  }

  static public <T> List<T> joinDiff(Collection<T> col1, Collection<T> col2, Comparator<T> comparator) {
    List<T> holder = new ArrayList<>();
    if(isEmpty(col1)) return holder;
    if(isEmpty(col2)) {
      holder.addAll(col1);
      return holder;
    }
    for(T rec1 : col1) {
      boolean match = false;
      for(T rec2 : col2) {
        if(comparator.compare(rec1, rec2) == 0) {
          match = true;
          break;
        }
      }
      if(!match) holder.add(rec1);
    }
    return holder;
  }

  static public <R, T> List<R> transform(List<T> list, Transformer<R, T> transformer) {
    List<R> holder = new ArrayList<>();
    if(isEmpty(list)) return holder;
    for(int i = 0; i < list.size(); i++) {
      T sel = list.get(i);
      R r = transformer.transform(sel);
      if(r == null) continue;
      holder.add(r);
    }
    return holder;
  }

  static public <T> void apply(Collection<T> collection, Apply<T> apply) {
    if(isEmpty(collection)) return;
    for(T sel : collection) {
      apply.apply(sel);
    }
  }

  static public <T> void validate(Collection<T> collection, Validator<T> validator) {
    validate(collection, validator, null);
  }

  static public <T> void validate(Collection<T> collection, Validator<T> validator, String message) {
    if(isEmpty(collection)) return ;
    int count = 0;
    for(T sel : collection) {
      if(!validator.validate(sel)) {
        count++;
      }
    }
    if(count > 0) {
      if(message == null) {
        message = count + " items in the collection are not valid" ;
      }
      throw new RuntimeError(ErrorType.IllegalArgument, message);
    }
  }
}
