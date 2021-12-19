package com.ddthien.itraining.core.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

import com.ddthien.itraining.core.common.ClientInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@Getter @Setter
abstract  public class Persistable<PK extends Serializable>
        implements org.springframework.data.domain.Persistable<PK> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    protected PK     id;

    @JsonIgnore
    @Transient
    public boolean isNew() { return null == getId(); }

    public void set(ClientInfo client, Date time) {
    }

    public void set(String remoteUser, Date time) {
    }
}
