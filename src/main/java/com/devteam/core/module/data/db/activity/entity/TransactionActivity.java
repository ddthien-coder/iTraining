package com.devteam.core.module.data.db.activity.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.devteam.core.module.data.db.entity.ICompany;
import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.devteam.core.util.ds.Arrays;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
  name = TransactionActivity.TABLE_NAME,
  indexes = { @Index(columnList = "name") }
)
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor @Getter @Setter
public class TransactionActivity extends PersistableEntity<Long> {
  private static final long serialVersionUID = 1L;
  
  public static final String TABLE_NAME = "core_activity_transaction";

  private String name ;
  private String label;
  @Column(length = 64 * 1024)
  private String description;

  @Column(name="company_id")
  private Long companyId;
  
  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "transaction_activity_id", referencedColumnName = "id")
  private List<EntityActivity> entityActivities;

  public TransactionActivity withActivity(EntityActivity ... activities) {
    entityActivities = Arrays.addToList(entityActivities, activities);
    return this;
  }

  public TransactionActivity withCompany(ICompany company) {
    if(company != null) companyId = company.getId();
    return this;
  }
  
  
  public TransactionActivity withGeneratedDescription() {
    StringBuilder b = new StringBuilder();
    for(EntityActivity entity : entityActivities) {
      b.append(entity.generateDescription());
      b.append("\n");
    }
    description = b.toString();
    if(description.length() > (64 * 1024)) {
      System.out.println("Activity Log Too Long:");
      System.out.println(description);
      description = description.substring(0, 64 * 1024);
    }
    return this;
  }

  public void resolveInfo() {
    if(entityActivities != null) {
      for(EntityActivity entity : entityActivities) {
        entity.resolveInfo();
      }
    }
  }
}
