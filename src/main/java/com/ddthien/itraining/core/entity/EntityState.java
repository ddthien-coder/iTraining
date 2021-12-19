package com.ddthien.itraining.core.entity;

public enum EntityState {
    CREATED, INACTIVE, JUNK, DEPRECATED, ACTIVE, ARCHIVED;

    static public EntityState[] ALL = EntityState.values();
}
