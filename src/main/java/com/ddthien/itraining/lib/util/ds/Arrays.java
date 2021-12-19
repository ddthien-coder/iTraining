package com.ddthien.itraining.lib.util.ds;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.ddthien.itraining.lib.util.ds.Objects.Transformer;
import com.ddthien.itraining.lib.util.error.ErrorType;
import com.ddthien.itraining.lib.util.error.RuntimeError;


public class Arrays {
    static public <T> void assertNotEmpty(T[] array) {
        assertNotEmpty(array, "Array is null or empty");
    }

    static public <T> void assertNotEmpty(T[] array, String message) {
        if(array == null || array.length == 0) {
            throw new RuntimeError(ErrorType.IllegalArgument, message);
        }
    }

    static public <T> boolean isEmpty(T[] array) {
        if(array == null || array.length == 0) return true;
        return false;
    }

    static public <T> boolean isNotEmpty(T[] array) {
        return !isEmpty(array);
    }

    @SafeVarargs
    static public <T> List<T> asList(T ... obj) {
        List<T> holder = new ArrayList<T>();
        for(T sel : obj) holder.add(sel);
        return holder;
    }

    @SafeVarargs
    static public <T> Set<T> asSet(T ... obj) {
        Set<T> holder = new HashSet<T>();
        for(T sel : obj) holder.add(sel);
        return holder;
    }

    @SafeVarargs
    static public <T> List<T> addToList(List<T> holder, T ... obj) {
        if(holder == null) holder = new ArrayList<T>();
        for(T sel : obj) holder.add(sel);
        return holder;
    }

    static public <R, T> List<R> addToList(List<R> holder, T[] obj, Transformer<R, T> transformer) {
        if(holder == null) holder = new ArrayList<R>();
        for(T sel : obj) {
            R r = transformer.transform(sel);
            if(r == null) continue;
            holder.add(r);
        }
        return holder;
    }

    @SafeVarargs
    static public <T> Set<T> addToSet(Set<T> holder, T ... obj) {
        if(holder == null) holder = new HashSet<T>();
        for(T sel : obj) holder.add(sel);
        return holder;
    }
}
