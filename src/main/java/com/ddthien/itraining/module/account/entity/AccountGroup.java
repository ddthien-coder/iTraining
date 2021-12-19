package com.ddthien.itraining.module.account.entity;

import com.ddthien.itraining.core.entity.EntityAttribute;
import com.ddthien.itraining.core.entity.PersistableEntity;
import com.ddthien.itraining.lib.util.text.StringUtil;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "AccountGroup")
@NoArgsConstructor @Setter @Getter
public class AccountGroup extends PersistableEntity<Long> {

    @NotNull
    private String name;

    @NotNull
    @Column(unique = true)
    private String path;
    private String parentPath;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "AccountGroupAttribute", joinColumns = @JoinColumn(name = "accountGroupId"))
    private List<EntityAttribute> attributes;

    public AccountGroup(String name) {
        this.name = name;
        this.path = name;
    }

    public AccountGroup(AccountGroup parent, String name) {
        this.name = name;
        if (parent == null) {
            this.path = name;
        } else {
            parentPath = parent.getPath();
            path       = parent.getPath() + "/" + name;
        }
    }

    public AccountGroup withName(String name) {
        this.name = name;
        return this;
    }

    public AccountGroup withPath(String path) {
        this.path = path;
        return this;
    }

    public String getParentPath() {
        return parentPath;
    }

    public void setParentPath(String parentPath) {
        if (StringUtil.isEmpty(parentPath))
            this.parentPath = null;
        else
            this.parentPath = parentPath;
    }

    public AccountGroup withParent(AccountGroup parent) {
        if (parent == null) {
            this.path       = this.name;
            this.parentPath = null;
        } else {
            path       = parent.getPath() + "/" + name;
            parentPath = parent.getPath();
        }
        return this;
    }

    public List<EntityAttribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(EntityAttribute attribute) {
        if (attributes == null)
            attributes = new ArrayList<EntityAttribute>();
        this.attributes.add(attribute);
    }

    @Override
    public String toString() {
        return path;
    }
}