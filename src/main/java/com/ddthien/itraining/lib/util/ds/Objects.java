package com.ddthien.itraining.lib.util.ds;

import com.ddthien.itraining.lib.util.error.ErrorType;
import com.ddthien.itraining.lib.util.error.RuntimeError;

public class Objects {
    static public interface Selector<T> { public boolean select(T obj) ; }

    static public interface Validator<T> { public boolean validate(T obj) ; }

    static public interface Transformer<R, T> { public R transform(T obj) ; }

    static public interface Apply<T> { public void apply(T obj) ; }

    static public interface Creator<T> { public T create() ; }

    static public <T> void assertNotNull(T obj) {
        assertNotNull(obj, "Object is null or empty");
    }

    static public <T> void assertNotNull(T obj, String message, Object ... args) {
        if(obj == null) {
            if(args.length > 0) {
                message = message.format(String.valueOf(args));
            }
            throw new RuntimeError(ErrorType.IllegalArgument, message);
        }
    }

    static public <T> T ensureNotNull(T obj, Creator<T> creator) {
        if(obj == null) return creator.create();
        return obj;
    }

    static public <T> void assertEquals(T obj1, T obj2) {
        assertNotNull(obj1, null);
        assertNotNull(obj2, null);
        if(!obj1.equals(obj2)) {
            throw new RuntimeError(ErrorType.IllegalArgument, "Two objects are not equals. obj1 = " + obj1 + ", obj2 = " + obj2);
        }
    }

    static public <T> void assertEquals(T obj1, T obj2, String message) {
        assertNotNull(obj1, message);
        assertNotNull(obj2, message);
        if(!obj1.equals(obj2)) {
            throw new RuntimeError(ErrorType.IllegalArgument, message);
        }
    }

    static public <T> void assertTrue(boolean b) {
        if(!b) {
            throw new RuntimeError(ErrorType.IllegalArgument, "Value is not true");
        }
    }

    static public <T> void assertTrue(boolean b, String message) {
        if(!b) {
            throw new RuntimeError(ErrorType.IllegalArgument, message);
        }
    }

    static public <T> boolean isNull(T obj) {
        if(obj == null) return true;
        return false;
    }

    static public <T> boolean nonNull(T obj) {
        if(obj != null) return true;
        return false;
    }
}
