package com.ddthien.itraining.core.entity;

import com.ddthien.itraining.lib.util.DateUtil;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;


@Embeddable
public class EntityAttribute {
    static public enum Type {
        String, StringArray, Integer, Float, Double, Boolean, Date
    }

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Type type;

    private String value;

    public EntityAttribute() {
    }

    public EntityAttribute(String name, String value) {
        this.name = name;
        this.type = Type.String;
        this.value = value;
    }

    public EntityAttribute(String name, Date value) {
        this.name = name;
        this.type = Type.Date;
        this.value = DateUtil.asCompactDateTime(value);
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}

