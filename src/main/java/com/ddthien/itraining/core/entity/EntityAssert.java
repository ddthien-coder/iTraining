package com.ddthien.itraining.core.entity;

import org.junit.Assert;

import java.util.List;

public class EntityAssert {
    static public void assertArchiveMode(PersistableEntity<Long> entity) {
        if(entity == null) return ;
        Assert.assertEquals(EntityState.ARCHIVED, entity.getEntityState());
    }

    static public <T extends PersistableEntity<Long>> void assertArchiveMode(List<T> entities) {
        if(entities == null) return ;
        for(PersistableEntity<Long> selEntity : entities) {
            Assert.assertEquals(EntityState.ARCHIVED, selEntity.getEntityState());
        }
    }
}
