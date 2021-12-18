package com.ddthien.itraining.core.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

import org.springframework.data.domain.Persistable;

import com.fasterxml.jackson.annotation.JsonIgnore;

@MappedSuperclass
public abstract class AbstractPersistable<PK extends Serializable> implements Persistable<PK> {
    final static public String[] TRACK_FIELDS = {"createdBy", "createdTime", "modifiedBy", "modifiedTime"};

    static public enum State { ORIGIN, MODIFIED, DELETED, NEW }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private PK      id;

    private String  createdBy;
    private Date    createdTime;

    private String  modifiedBy;
    private Date    modifiedTime;


    @Transient
    private State persistableState	= State.ORIGIN;

    public AbstractPersistable() {
        this.createdTime = new Date();
    }

    public PK getId() { return id; }
    public void setId(final PK id) { this.id = id; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public Date getCreatedTime() { return createdTime; }
    public void setCreatedTime(Date createdTime) { this.createdTime = createdTime; }

    public String getModifiedBy() { return modifiedBy; }
    public void setModifiedBy(String modifiedBy) { this.modifiedBy = modifiedBy; }

    public Date getModifiedTime() { return modifiedTime; }
    public void setModifiedTime(Date modifiedTime) { this.modifiedTime = modifiedTime; }

    final public State getPersistableState() { return this.persistableState; }
    final public void setPersistableState(State state) { this.persistableState = state; }

    @JsonIgnore
    public boolean isNew() { return null == getId(); }

    public void copy(AbstractPersistable<PK> other) {
        if (id != null && !id.equals(other.id)) {
            throw new RuntimeException("The entity id are not the same");
        }
        setId(other.id);
        setCreatedBy(other.createdBy);
        setCreatedTime(other.createdTime);
        setModifiedBy(other.modifiedBy);
        setModifiedTime(other.modifiedTime);
        setPersistableState(other.persistableState);
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
        AbstractPersistable<?> that = (AbstractPersistable<?>) obj;
        return null == this.getId() ? false : this.getId().equals(that.getId());
    }

    @Override
    public int hashCode() {
        int hashCode = 17;
        hashCode += null == getId() ? 0 : getId().hashCode() * 31;
        return hashCode;
    }
}