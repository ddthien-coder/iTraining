package com.ddthien.itraining.core.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

import com.ddthien.itraining.core.common.ClientInfo;
import com.ddthien.itraining.lib.util.DateUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@Getter @Setter
abstract  public class PersistableEntity<PK extends Serializable>
        extends Persistable<PK> {
    final static public String[] TRACK_FIELDS = {
            "id", "createdBy", "createdTime", "modifiedBy", "modifiedTime", "entityState"
    };

    final static public EntityState[] STATES       = EntityState.values();

    private String createdBy;

    @JsonFormat(pattern = DateUtil.COMPACT_DATETIME_FORMAT)
    private Date   createdTime;

    private String modifiedBy;

    @JsonSerialize(as = Date.class)
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern = DateUtil.COMPACT_DATETIME_FORMAT)
    private Date   modifiedTime;

    @Enumerated(EnumType.STRING)
    private EntityState entityState = EntityState.ACTIVE;

    @Transient
    private EditState editState = EditState.ORIGIN;

    @Transient
    private LoadState loadState = LoadState.FromDB;

    public void markDeleted() { markState(EditState.DELETED); }

    public void markModified() { markState(EditState.MODIFIED); }

    private void markState(EditState state) {
        if(isNew()) {
            throw new RuntimeException("Cannot mark the state when the object is new");
        }
        this.editState = state;
    }

    final public void set(ClientInfo client) { set(client, new Date()); }

    public void set(ClientInfo client, Date time) {
        super.set(client, time);
        set(client.getRemoteUser(), time);
    }

    public void set(String remoteUser, Date time) {
        super.set(remoteUser, time);
        if(editState == EditState.IMPORT) return;
        if(isNew()) {
            if(createdBy == null)   setCreatedBy(remoteUser);
            if(createdTime == null) setCreatedTime(time);
        }
        setModifiedBy(remoteUser);
        setModifiedTime(time);
    }

    public void copy(PersistableEntity<PK> other) {
        if (id != null && !id.equals(other.id)) {
            throw new RuntimeException("The entity id are not the same");
        }
        setId(other.id);
        setCreatedBy(other.createdBy);
        setCreatedTime(other.createdTime);
        setModifiedBy(other.modifiedBy);
        setModifiedTime(other.modifiedTime);
        setEditState(other.editState);
    }

    public <T extends PersistableEntity<?>> T clearIds() {
        setId(null);
        return (T) this;
    }

    public void clearId(PersistableEntity<PK> other) {
        if(other == null) return;
        other.setId(null);
    }

    public <T extends PersistableEntity<PK>>void clearIds(List<T> others) {
        if(others == null) return;
        for(T sel : others) sel.clearIds();
    }

    @Override
    public String toString() {
        return String.format("Entity of type %s with id: %s", this.getClass().getName(), getId());
    }

    @Override
    public boolean equals(Object obj) {
        if (null == obj) {
            return false;
        }

        if (this == obj) {
            return true;
        }

        if (!getClass().equals(obj.getClass())) {
            return false;
        }
        PersistableEntity<?> that = (PersistableEntity<?>) obj;
        return null == this.getId() ? false : this.getId().equals(that.getId());
    }

    @Override
    public int hashCode() {
        int hashCode = 17;
        hashCode += null == getId() ? 0 : getId().hashCode() * 31;
        return hashCode;
    }

    static public void set(ClientInfo client, Collection<? extends PersistableEntity<Long>> items, Date time) {
        if(items != null) {
            for(PersistableEntity<Long> item : items) {
                if(item.isNew()) item.set(client, time);
                else if(item.getEditState() == EditState.MODIFIED) item.set(client, time);
            }
        }
    }

    static public List<Long> getIds(List<? extends PersistableEntity<Long>> items) {
        List<Long> holder = new ArrayList<>();
        if(items != null) {
            for(int i = 0; i < items.size(); i++) {
                holder.add(items.get(i).getId()) ;
            }
        }
        return holder;
    }

    @Converter
    static public class StringListConverter implements AttributeConverter<List<String>, String> {
        private static final String SPLIT_CHAR = ";";

        @Override
        public String convertToDatabaseColumn(List<String> stringList) {
            if(stringList == null) return null ;
            return String.join(SPLIT_CHAR, stringList);
        }

        @Override
        public List<String> convertToEntityAttribute(String string) {
            if(string == null) return null ;
            return Arrays.asList(string.split(SPLIT_CHAR));
        }
    }

    @Converter
    static public class StringSetConverter implements AttributeConverter<Set<String>, String> {
        private static final String SPLIT_CHAR = ";";

        @Override
        public String convertToDatabaseColumn(Set<String> stringList) {
            if(stringList == null) return null ;
            return String.join(SPLIT_CHAR, stringList);
        }

        @Override
        public Set<String> convertToEntityAttribute(String string) {
            if(string == null) return null ;
            Set<String> set = new HashSet<>();
            for(String sel : string.split(SPLIT_CHAR)) set.add(sel);
            return set;
        }
    }
}