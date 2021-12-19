package com.ddthien.itraining.core.database.entity;

import com.ddthien.itraining.core.entity.PersistableEntity;
import com.ddthien.itraining.lib.util.bean.BeanInspector;
import com.ddthien.itraining.lib.util.ds.Objects;
import com.ddthien.itraining.lib.util.text.StringUtil;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.Setter;

@JsonInclude(Include.NON_NULL)
public class SearchFilter  {
    static public String LIKE_OP  = "LIKE" ;
    static public String ILIKE_OP = "LIKE" ;

    @Getter @Setter
    private String     name;

    @Getter @Setter
    private String filterOp;

    @Getter @Setter
    private FilterType filterType = FilterType.String;

    @Getter @Setter
    private String filterExpression;

    @Getter @Setter
    private String filterName;

    @Getter @Setter
    private String filterValue;

    @Getter @Setter
    private boolean required = true;

    public SearchFilter() {}

    public SearchFilter(String name) {
        this.name = name;
        this.filterName = name;
    }

    SearchFilter(String name, String filterOp, String paramName) {
        this.name = name;
        this.filterName = paramName;
        this.filterOp = filterOp;
    }

    public SearchFilter(Class<?> entity, String field, String filterOp, String name) {
        this(entity, new String[] {field}, filterOp, name);
    }

    public SearchFilter(Class<?> entity, String[] fields, String filterOp, String filterName) {
        this(filterName, entity, fields, filterOp, filterName);
    }

    public SearchFilter(String name, Class<?> entity, String[] fields, String filterOp, String filterName) {
        this.name = name;
        this.filterName = filterName;
        this.filterOp = filterOp;
        BeanInspector<?> inspector = BeanInspector.get(entity);
        StringBuilder b = new StringBuilder();
        boolean first = true;
        for(String field : fields) {
            if(!first) b.append(" OR ");
            String tableField = SqlUtil.createFieldExpression(inspector, field);
            b.append(tableField).append(" ").append(filterOp).append(" :").append(filterName);
            first = false;
        }
        this.filterExpression = b.toString();
    }

    public boolean hasValue() {
        return !StringUtil.isEmpty(filterValue);
    }

    public SearchFilter value(String value) {
        this.filterValue = value;
        return this;
    }

    public Object createFilterParamValue() {
        String value = filterValue;
        return SqlUtil.createFilterValue(filterType, filterOp, value);
    }

    public SearchFilter paramClone() {
        SearchFilter clone = new SearchFilter(name, filterName, filterOp);
        clone.filterValue = filterValue;
        return clone;
    }

    public void mergeValue(SearchFilter other) {
        assertSameFilter(other);
        filterValue = other.getFilterValue();
    }

    protected void assertSameFilter(SearchFilter other) {
        Objects.assertEquals(name, other.getName(), "Not same name");
    }

    static public void supportILike(String dialect) {
        if(Objects.isNull(dialect)) return;
        if(dialect.indexOf("Postgre") >=0 || dialect.indexOf("H2Dialect") >=0 ) {
            ILIKE_OP = "ILIKE" ;
        }
    }

    static public <T extends PersistableEntity<Long>> SearchFilter isearch(Class<T> entityType, String ... fields) {
        SearchFilter search = new SearchFilter("search", entityType, fields, ILIKE_OP, "search");
        return search;
    }

    static public <T extends PersistableEntity<Long>> SearchFilter isearch(String name, Class<T> entityType, String[] fields) {
        SearchFilter search = new SearchFilter(name, entityType, fields, ILIKE_OP, "search");
        return search;
    }

    static public <T extends PersistableEntity<Long>> SearchFilter search(Class<T> entityType, String ... fields) {
        SearchFilter search = new SearchFilter(entityType, fields, LIKE_OP, "search");
        return search;
    }
}

