package com.devteam.core.module.data.db;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.devteam.core.module.data.db.query.SelectField;
import com.devteam.core.util.text.StringUtil;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;


public class SqlResultSetExtractor implements ResultSetExtractor<SqlSelectView> {
  private String[]     field;
  private Class<?>     entityType;
  
  public SqlResultSetExtractor() { }
  
  
  public SqlResultSetExtractor(String[] field) { 
    this.field = field; 
  }

  public SqlResultSetExtractor(List<SelectField> fields) {
    this.field = new String[fields.size()];
    for(int i = 0; i < fields.size(); i++) {
      this.field[i] = fields.get(i).getAlias();
    }
  }
  
  public SqlResultSetExtractor(Class<?> entityType) {
    this.entityType = entityType;
  }

  @Override
  public SqlSelectView extractData(ResultSet rs) throws SQLException, DataAccessException {
    if(field == null) {
      ResultSetMetaData meta = rs.getMetaData();
      String[] column = new String[meta.getColumnCount()];
      for(int i = 0; i < column.length; i++) {
        column[i] =  meta.getColumnLabel(i + 1);
      }
      
      if(entityType != null) {
        String[] property = getEntityProperties(entityType);
        List<String> fieldHolder = new ArrayList<String>();
        for(String sel : property) {
          if(StringUtil.isInIgnoreCase(sel, column)) fieldHolder.add(sel);
        }
        field = new String[fieldHolder.size()];
        field = fieldHolder.toArray(field);
      } else {
        field = column;
      }
    }
    
    List<Object[]> holder = new ArrayList<>();
    while(rs.next()) {
      Object[] cell = new Object[field.length];
      for(int i = 0; i < field.length; i++) {
        cell[i] = rs.getObject(field[i]);
      }
      holder.add(cell);
    }
    Object[] rows = new Object[holder.size()];
    rows = holder.toArray(rows);
    return new SqlSelectView(field, rows);
  }

  String[] getEntityProperties(Class<?> type) {
    try {
      BeanInfo info = Introspector.getBeanInfo(type);
      PropertyDescriptor[] pDescriptors = info.getPropertyDescriptors();
      String[] property = new String[pDescriptors.length];
      for(int i = 0; i < pDescriptors.length; i++) {
        property[i] = pDescriptors[i].getName();
      }
      return property;
    } catch(Exception ex) {
      throw new RuntimeException(ex);
    }
  }
}