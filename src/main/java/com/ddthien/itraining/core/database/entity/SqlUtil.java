package com.ddthien.itraining.core.database.entity;

import com.ddthien.itraining.lib.util.DateUtil;
import com.ddthien.itraining.lib.util.bean.BeanInspector;
import com.ddthien.itraining.lib.util.text.StringUtil;

import javax.persistence.Column;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.lang.annotation.Annotation;
import java.util.Objects;

public class SqlUtil {

    static public SelectField createSelectField(BeanInspector<?> inspector, String fieldName) {
        Table tableAnnotation = inspector.getType().getDeclaredAnnotation(Table.class);
        String table = tableAnnotation.name();

        java.lang.reflect.Field beanField = inspector.getField(fieldName);
        if(Objects.isNull(beanField)) {
            return null;
        }
        Annotation transientAnnotation = beanField.getDeclaredAnnotation(Transient.class);
        if(transientAnnotation != null) return null;

        String tableField = fieldName;
        Column columnAnnotation = beanField.getDeclaredAnnotation(Column.class);
        if(columnAnnotation != null) {
            if(!StringUtil.isEmpty(columnAnnotation.name())) {
                tableField = columnAnnotation.name();
            }
        }
        SelectField field = new SelectField(table + "." + tableField, fieldName);
        return field;
    }

    static public String createFieldExpression(String table, String fieldName) {
        return table + "." + fieldName;
    }

    static public String createFieldExpression(Class<?> entity, String fieldName) {
        BeanInspector<?> inspector = BeanInspector.get(entity);
        return createFieldExpression(inspector, fieldName);
    }

    static public String createFieldExpression(BeanInspector<?> inspector, String fieldName) {
        Table tableAnnotation = inspector.getType().getDeclaredAnnotation(Table.class);
        String table = tableAnnotation.name();

        String tableField = fieldName;
        java.lang.reflect.Field beanField = inspector.getField(fieldName);
        if(beanField != null) {
            Column columnAnnotation = beanField.getDeclaredAnnotation(Column.class);
            if(columnAnnotation != null) {
                if(!StringUtil.isEmpty(columnAnnotation.name())) {
                    tableField = columnAnnotation.name();
                }
            }
        }
        return table + "." + tableField;
    }

    static public Object createFilterValue(FilterType type, String filterOp, String value) {
        if(StringUtil.isEmpty(value)) return null;
        if("ILIKE".equalsIgnoreCase(filterOp) ||"LIKE".equalsIgnoreCase(filterOp)) {
            if(value.indexOf('*') >= 0) {
                return value.replace('*', '%');
            } else {
                return value + '%';
            }
        } else if(FilterType.Date == type) {
            return DateUtil.parseCompactDateTime(value);
        }
        return value;
    }

    static public String createClause(Class<?> entity1, String entity1Field, String op, Class<?> entity2, String entity2Field) {
        String clause =
                createFieldExpression(entity1, entity1Field) +
                        " " + op + " " +
                        createFieldExpression(entity2, entity2Field) ;
        return clause;
    }

    static public String createClause(Class<?> entity1, String entity1Field, String op, String table, String tableField) {
        String clause =
                createFieldExpression(entity1, entity1Field) +
                        " " + op + " " +
                        createFieldExpression(table, tableField) ;
        return clause;
    }

    static public String createClause(Class<?> entity, String field, String op, String variable) {
        return createFieldExpression(entity, field) + " " + op + " " + variable;
    }
}
