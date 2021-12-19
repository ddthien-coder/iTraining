package com.ddthien.itraining.core.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ChangeStorageStateRequest {
    @Enumerated(EnumType.STRING)
    private EntityState newStorageState;
    private List<Long>  entityIds;

    public ChangeStorageStateRequest(EntityState newState) {
        this.newStorageState = newState;
    }

    public ChangeStorageStateRequest withEntityId(Long id) {
        if(entityIds == null) entityIds = new ArrayList<>();
        entityIds.add(id);
        return this;
    }
}
