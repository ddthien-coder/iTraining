package com.ddthien.itraining.core.database.entity;

import lombok.Getter;
import lombok.Setter;

public class ClauseFilter {
    @Getter @Setter
    private String clause;

    public ClauseFilter() {
    }

    public ClauseFilter(Class<?> entity1, String entity1Field, String op, Class<?> entity2, String entity2Field) {
        clause = SqlUtil.createClause(entity1, entity1Field, op, entity2, entity2Field);
    }

    public ClauseFilter(Class<?> entity1, String entity1Field, String op, String entity2TableName, String entity2Field) {
        clause = SqlUtil.createFieldExpression(entity1, entity1Field) + " " + op + " " + entity2TableName + "." + entity2Field;
    }

    public ClauseFilter(String entity1TableName, String entity1Field, String op, String variable) {
        clause = SqlUtil.createFieldExpression(entity1TableName, entity1Field) + " " + op + " " + variable;
    }

    public ClauseFilter(Class<?> entity, String field, String op, String variable) {
        clause = SqlUtil.createFieldExpression(entity, field) + " " + op + " " + variable;
    }

    public ClauseFilter AND(Class<?> entity1, String entity1Field, String op, Class<?> entity2, String entity2Field) {
        clause += " AND " + SqlUtil.createClause(entity1, entity1Field, op, entity2, entity2Field);
        return this;
    }

    public ClauseFilter AND(Class<?> entity1, String entity1Field, String op, String table, String tableField) {
        clause += " AND " + SqlUtil.createClause(entity1, entity1Field, op, table, tableField);
        return this;
    }

    public ClauseFilter AND(Class<?> entity, String field, String op, String variable) {
        clause +=  " AND " + SqlUtil.createFieldExpression(entity, field) + " " + op + " " + variable;
        return this;
    }

    public ClauseFilter OR(Class<?> entity1, String entity1Field, String op, Class<?> entity2, String entity2Field) {
        clause += " OR " + SqlUtil.createClause(entity1, entity1Field, op, entity2, entity2Field);
        return this;
    }

    public ClauseFilter OR(Class<?> entity, String field, String op, String variable) {
        clause += " OR " + SqlUtil.createFieldExpression(entity, field) + " " + op + " " + variable;
        return this;
    }
}
