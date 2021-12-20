package com.devteam.core.module.security.entity;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import com.devteam.core.module.data.db.entity.PersistableEntity;
import com.devteam.core.util.cipher.MD5;
import com.devteam.core.util.text.DateUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
  name = AccessToken.TABLE_NAME,
  uniqueConstraints = {
    @UniqueConstraint(
      name = AccessToken.TABLE_NAME + "_token",
      columnNames = {"token"}),
  },
  indexes = {
    @Index(columnList="token")
  }
 )
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor @Getter @Setter
public class AccessToken extends PersistableEntity<Long> {
  private static final long serialVersionUID = 1L;

  public static final String TABLE_NAME = "security_access_token";

  static public enum AccessType { Account, Employee, Partner, Temporary, None }

  private String                label;

  @NotNull
  @Column(unique =true)
  private String                token;

  @Column(name = "pass_prase")
  private String                passPrase;

  @Enumerated(EnumType.STRING)
  @Column(name = "access_type")
  private AccessType            accessType;

  @Column(name = "login_id")
  private String                loginId;
  
  @Column(name = "access_count")
  private int accessCount = 0;

  @JsonFormat(pattern = DateUtil.COMPACT_DATETIME_FORMAT)
  @Column(name = "last_access_time")
  private Date                  lastAccessTime;

  @NotNull
  @JsonFormat(pattern = DateUtil.COMPACT_DATETIME_FORMAT)
  @Column(name = "expire_time")
  private Date  expireTime;
  
  
  public AccessToken(String token, AccessType accessType) {
    this.token = token;
    this.accessType = accessType;
  }
  
  @JsonIgnore
  public boolean isAuthorized() { return !accessType.equals(AccessType.None); }

  @JsonIgnore
  public boolean isExpired() {
    return System.currentTimeMillis() > expireTime.getTime();
  }
  
  public AccessToken withLabel(String label) { 
    this.label = label;
    return this;
  }

  public AccessToken withLoginId(String loginId) { 
    this.loginId = loginId;
    return this;
  }

  public AccessToken withToken(String token) { 
    this.token = token;
    return this;
  }

  public AccessToken withAccessType(AccessType type) { 
    this.accessType = type;
    return this;
  }

  public AccessToken withLastAccessTime(Date lastAccessTime) {
    this.lastAccessTime = lastAccessTime;
    return this;
  }

  public AccessToken incrAccessCount() {
    this.accessCount++;
    return this;
  }

  public AccessToken withGenToken() {
    String random = Long.toString(System.currentTimeMillis());
    token = MD5.digest(random + random.hashCode()).toString();
    return this;
  }

  public AccessToken withLiveTime(int minute) {
    LocalDateTime time = LocalDateTime.now();
    time = time.plusMinutes(minute);
    expireTime = Date.from((time.toInstant(ZoneOffset.UTC)));
    return this;
  }
}
