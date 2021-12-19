package com.ddthien.itraining.core.entity;

public enum StorageState {
    CREATED, INACTIVE, JUNK, DEPRECATED, ACTIVE, ARCHIVED;

    static public StorageState[] ALL = StorageState.values();
}
