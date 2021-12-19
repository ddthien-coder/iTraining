package com.ddthien.itraining.core.database.entity;

import com.ddthien.itraining.core.entity.PersistableEntity;
import com.ddthien.itraining.core.entity.StorageState;
import com.ddthien.itraining.lib.util.text.StringUtil;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Getter;
import lombok.Setter;


@JsonInclude(Include.NON_NULL)
public class OptionFilter extends FieldFilter {
    @Getter @Setter
    private String[] options;

    @Getter @Setter
    private String   selectOption;

    public OptionFilter() {}

    public OptionFilter(String name) {
        super(name);
    }

    public <T> OptionFilter(Class<?> entity, String field, String filterOp, T[] option) {
        super(entity, field, filterOp);
        this.options = new String[option.length];
        for(int i = 0; i < option.length; i++) {
            this.options[i] = option[i].toString();
        }
    }

    public <T> OptionFilter(Class<?> entity, String field, String filterOp, T[] option, T value) {
        this(entity, field, filterOp, option);
        value(value);
    }

    public OptionFilter required(boolean b) {
        setRequired(b);
        return this;
    }

    public OptionFilter type(FilterType type) {
        setFilterType(type);
        return this;
    }

    public OptionFilter value(String value) {
        if(StringUtil.isEmpty(value) || "none".equals(value)) selectOption = null;
        else this.selectOption = value;
        return this;
    }

    public <T> OptionFilter value(T value) {
        return value(value.toString());
    }

    public Object createFilterParamValue() {
        return SqlUtil.createFilterValue(getFilterType(), getFilterOp(), selectOption);
    }

    public String createFilterExpression() {
        return getTableField() + " = " + ":" +  getName();
    }

    public void mergeValue(OptionFilter other) {
        assertSameFilter(other);
        selectOption = other.getSelectOption();
    }

    static public <T extends PersistableEntity<Long>> OptionFilter storageState(Class<T> entity) {
        return new OptionFilter(entity, "storageState", "=", StorageState.ALL, StorageState.ACTIVE);
    }

    static public <T extends PersistableEntity<Long>, O> OptionFilter create(Class<T> entity, String field, O[] options) {
        return new OptionFilter(entity, field, "=", options);
    }
}
