package com.devteam.module.account.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.devteam.core.module.data.db.entity.SupportParentId;
import com.devteam.core.util.ds.Objects;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
  name = AccountGroup.TABLE_NAME,
  uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name"}),
  },
  indexes = { @Index(columnList = "name") }
)
@NoArgsConstructor @Getter @Setter
public class AccountGroup extends PersistableEntity<Long> implements SupportParentId {
  public static final String TABLE_NAME = "account_group";

  @Column(name="parent_id_path")
  private String parentIdPath;
  
  @Column(name="parent_id")
  private Long   parentId;
  
  @NotNull
  private String name;
  private String label;
  
  @Column(length = 65536)
  private String            description;
  
  public AccountGroup(String name, String label, String desc) {
    this.name = name;
    this.label = label;
    this.description = desc;
  }

  public AccountGroup(AccountGroup parent, String name, String label, String desc) {
    this.name = name;
    this.label = label;
    this.description = desc;
    withParent(parent);
  }

  public AccountGroup withParent(AccountGroup parent) {
    if(parent == null) {
      parentId = null;
      parentIdPath = null;
      return this;
    }
    Objects.assertTrue(!parent.isNew());
    this.parentId = parent.getId();
    if (parent.getParentIdPath() == null) {
      this.parentIdPath = Long.toString(parent.getId());
    } else {
      this.parentIdPath = parent.getParentIdPath() + "/" + parent.getId();
    }
    return this;
  }
}
