package com.devteam.core.module.data.db;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Table;
import javax.persistence.metamodel.Attribute;
import javax.persistence.metamodel.EntityType;

import com.devteam.core.util.bean.BeanInspector;
import com.devteam.core.util.ds.Arrays;
import com.devteam.core.util.ds.Collections;
import com.devteam.core.util.text.StringUtil;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @Getter @Setter
public class EntityInfo {
  private String                name;
  private String                category;
  private String                className;
  private String                tableName;
  private List<FieldDescriptor> fields;
  private Set<String>           checks;

  public EntityInfo(EntityType<?> type) {
    Class<?> javaType = type.getBindableJavaType();
    
    name      = javaType.getSimpleName();
    className = javaType.getName();
    tableName = javaType.getDeclaredAnnotation(Table.class).name();
    int prefixIdx = tableName.indexOf('_');
    if(prefixIdx > 0) {
      category = tableName.substring(0, prefixIdx);
    }  else {
      category = tableName;
    }
    fields = new ArrayList<>();
    BeanInspector<?> inspector = BeanInspector.get(javaType);
    for(Attribute<?, ?> sel : type.getAttributes()) {
      fields.add(new FieldDescriptor(inspector, sel));
    }
    detectProblem();
  }
  
  void addCheck(String ... check) {
    checks = Arrays.addToSet(checks, check);
  }
  
  void detectProblem() {
    for(FieldDescriptor sel : fields) {
      if(Collections.isNotEmpty(sel.checks)) {
        addCheck("TABLE_FIELD");
      }
    }
    if(tableName.length() > 60) {
      addCheck("TABLE_NAME_LENGTH");
    }
  }
  
  @NoArgsConstructor @Getter @Setter
  static public class FieldDescriptor {
    private String name;
    private String persistentType ;
    private String dataType; 
    private String tableFieldName;
    private Set<String> checks;
    
    public FieldDescriptor(BeanInspector<?> inspector, Attribute<?, ?> attr) {
      name = attr.getName();
      persistentType = attr.getPersistentAttributeType().toString();
      dataType = attr.getJavaType().getSimpleName();
      tableFieldName = name;
      Field field = inspector.getField(name);
      if(field != null) {
        Column columnAnnotation = field.getDeclaredAnnotation(Column.class);
        if(columnAnnotation != null) {
          if(!StringUtil.isEmpty(columnAnnotation.name())) {
            tableFieldName = columnAnnotation.name();
          }
        }
      } else {
        PropertyDescriptor descriptor = inspector.getPropertyDescriptor(name);
        if(descriptor != null) {
          Column column = descriptor.getReadMethod().getDeclaredAnnotation(Column.class); 
          if(column != null) {
            if(!StringUtil.isEmpty(column.name())) {
              tableFieldName = column.name();
            }
          }
        }
      }
      detectProblem();
    }
    
    void addCheck(String ... check) {
      checks = Arrays.addToSet(checks, check);
    }
    
    void detectProblem() {
      if(!"BASIC".equals(persistentType)) return;
      
      for(int i = 0; i < tableFieldName.length(); i++) {
        if(Character.isUpperCase(tableFieldName.charAt(i))) {
          addCheck("TABLE_FIELD");
          break;
        }
      }
    }
  }
}
