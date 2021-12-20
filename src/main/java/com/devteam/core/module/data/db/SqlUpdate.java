package com.devteam.core.module.data.db;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

public class SqlUpdate<E> {
  @Getter @Setter
  private Class<E>           entityType;
  
  @Getter @Setter
  private List<UpdateEntity> entities = new ArrayList<>();

  public SqlUpdate() {}
  
  public SqlUpdate(Class<E> entity) { this.entityType = entity; }
  
  public UpdateEntity entity(Long id) {
    UpdateEntity entity = new UpdateEntity(id);
    entities.add(entity);
    return entity;
  }
  
  public String toUpdateSql() {
    String tableName = null;
    Table table = entityType.getAnnotation(Table.class);
    if(table != null) tableName = table.name();
    else tableName = entityType.getSimpleName();
    
    UpdateEntity entity = entities.get(0);
    StringBuilder b = new StringBuilder();
    b.append("UPDATE ").append(tableName).append("\n");
    b.append("SET \n");
    List<Field> fields = entity.getFields();
    for(int i = 0; i < fields.size(); i++) {
      Field field = fields.get(i);
      if(i > 0)  b.append(",\n");
      b.append("  ").append(field.getName()).append(" = ").append(":").append(field.getName());
    }
    b.append("\n");
    b.append("WHERE id = :id");
    return b.toString();
  }
  
  static public class UpdateEntity {
    private Long        id;
    private List<Field> fields = new ArrayList<>();
    
    public UpdateEntity() { }
    
    public UpdateEntity(Long id) { this.id = id ; }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<Field> getFields() { return fields; }
    public void setFields(List<Field> fields) { this.fields = fields; }
    
    public UpdateEntity update(String field, Object value) {
      fields.add(new Field(field, value));
      return this;
    }
  }
  
  static public class Field {
    private String name;
    private Object value;
    
    public Field() {}
    
    public Field(String name, Object value) {
      this.name = name;
      this.value = value;
    }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Object getValue() { return value; }
    public void setValue(Object value) { this.value = value; }
  }
}