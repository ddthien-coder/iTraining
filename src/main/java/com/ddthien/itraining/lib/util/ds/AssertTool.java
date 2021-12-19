package com.ddthien.itraining.lib.util.ds;

import java.util.Collection;

import org.junit.jupiter.api.Assertions;

public class AssertTool extends Assertions {
    static public boolean assertEmpty(Collection<?> col) {
        return col == null || col.size() == 0;
    }

    static public boolean sameIdentifier(IdentifiableObject o1, IdentifiableObject o2) {
        assertNotNull(o1);
        assertNotNull(o2);
        return o1.identify().equals(o2.identify());
    }

    static public <T extends IdentifiableObject> void assertInCollection(T record, Collection<T> list) {
        if(list == null) {
            fail("list is null");
        }
        if(record == null) {
            fail("record is null");
        }
        for(T selRec : list) {
            if(sameIdentifier(record, selRec)) return;
        }
        fail("record is not in list");
    }

    static public <T extends IdentifiableObject> void assertNotInCollection(T record, Collection<T> list) {
        if(Collections.isEmpty(list)) return;
        for(T selRec : list) {
            if(sameIdentifier(record, selRec)) {
                fail("record is in the collection");
            }
        }
    }

    static public <T extends IdentifiableObject> void assertSameCollection(Collection<T> col1, Collection<T> col2) {
        if((col1 == null || col1.size() == 0) && (col2 == null || col2.size() == 0)) return ;
        if(col1 == null) {
            fail("list 1 is null while list2 has " + col2.size() + " items");
        }
        if(col2 == null) {
            fail("list 2 is null while list 1 has " + col1.size() + " items");
        }
        assertEquals(col1.size(), col2.size());
        for(T rec1 : col1) {
            boolean hasRecord = false;
            for(T rec2 : col2) {
                if(sameIdentifier(rec1, rec2)) {
                    hasRecord = true;
                    break;
                }
            }
            if(!hasRecord) {
                fail("List 1 has record that is not existed in list 2");
            }
        }
    }
}

