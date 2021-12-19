package com.ddthien.itraining.core.database;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.ddthien.itraining.lib.util.DateUtil;
import com.ddthien.itraining.lib.util.text.StringUtil;
import com.ddthien.itraining.lib.util.text.TabularFormater;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;


public class SqlSelectView {
    private String[]   columns;
    private Object[][] values;

    public SqlSelectView() {}

    public SqlSelectView(String[] fields, Object[] rows) {
        this.columns = fields;
        values = new Object[rows.length][];
        for(int i = 0; i < rows.length; i++) {
            values[i] = (Object[]) rows[i];
        }
    }

    public String[] getColumns() { return columns; }
    public void setColumns(String[] fields) { this.columns = fields; }

    @JsonSerialize(using = CellSerializer.class)
    public Object[][] getValues() { return values; }

    @JsonDeserialize(using = CellDeserializer.class)
    public void setValues(Object[][] values) { this.values = values; }

    @JsonIgnore
    public int getRowCount() { return values.length; }

    public SqlRecord getRecord(int row) { return new SqlRecord(columns, values[row]); }

    public Object getRecordCellValue(int row, int col) { return values[row][col]; }

    @JsonIgnore
    public List<SqlRecord> getRecords() {
        List<SqlRecord> holder = new ArrayList<>();
        for(int i = 0; i < getRowCount(); i++) {
            holder.add(getRecord(i));
        }
        return holder;
    }

    @JsonIgnore
    @Deprecated
    public List<Map<String, Object>> getMapRecords() {
        List<Map<String, Object>> holder = new ArrayList<>();
        for(int i = 0; i < getRowCount(); i++) {
            holder.add(new SqlMapRecord(columns, values[i]));
        }
        return holder;
    }

    @JsonIgnore
    public List<SqlMapRecord> getSqlMapRecords() {
        List<SqlMapRecord> holder = new ArrayList<>();
        for(int i = 0; i < getRowCount(); i++) {
            holder.add(new SqlMapRecord(columns, values[i]));
        }
        return holder;
    }

    public SqlMapRecord getMapRecord(int row) { return new SqlMapRecord(columns, values[row]); }

    public void dump() { dump(null); }

    public void dump(String title) {
        TabularFormater tFormater = new TabularFormater(columns);
        if(title != null) tFormater.setTitle(title);
        tFormater.addRows(values);
        System.out.println(tFormater.getFormattedText());
    }

    static public class CellDeserializer extends JsonDeserializer<Object> {
        public Object deserialize(JsonParser jsonParser, DeserializationContext ctx) throws IOException {
            ObjectCodec oc = jsonParser.getCodec();
            JsonNode node = oc.readTree(jsonParser);
            List<Object[]> rowHolder = new ArrayList<>();
            for(JsonNode rowNode : node) {
                List<Object> cellHolder = new ArrayList<>();
                for(JsonNode cellNode : rowNode) {
                    String encode = cellNode.asText();
                    char type = encode.charAt(0);
                    String val = encode.substring(2);
                    if(type == '_')      cellHolder.add(null);
                    else if(type == 'i') cellHolder.add(Integer.parseInt(val));
                    else if(type == 'l') cellHolder.add(Long.parseLong(val));
                    else if(type == 'f') cellHolder.add(Float.parseFloat(val));
                    else if(type == 'd') cellHolder.add(Double.parseDouble(val));
                    else if(type == 'D') cellHolder.add(DateUtil.parseCompactDateTime(val));
                    else if(type == 'A') cellHolder.add(StringUtil.toStringArray(val, ","));
                    else                 cellHolder.add(val);
                }
                Object[] cell = cellHolder.toArray(new Object[cellHolder.size()]);
                rowHolder.add(cell);
            }
            Object[][] rows = rowHolder.toArray(new Object[rowHolder.size()][]);
            return rows;
        }
    }

    static public class CellSerializer extends JsonSerializer<Object> {
        public  void serialize(Object result, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
            jsonGenerator.writeStartArray();;
            if(result != null) {
                Object[][] array = (Object[][]) result;
                for(Object row : array) {
                    Object[] cell = (Object[]) row;
                    jsonGenerator.writeStartArray();;
                    for(Object sel : cell) {
                        String encode = null ;
                        if(sel == null)                  encode = "_:null";
                        else if(sel instanceof Integer)  encode = "i:" + Integer.toString((Integer)sel);
                        else if(sel instanceof Long)     encode = "l:" + Long.toString((Long)sel);
                        else if(sel instanceof Float)    encode = "f:" + Float.toString((Float)sel);
                        else if(sel instanceof Double)   encode = "d:" + Double.toString((Double)sel);
                        else if(sel instanceof Date)     encode = "D:" + DateUtil.asCompactDateTime((Date)sel);
                        else if(sel instanceof String)   encode = "s:" + sel;
                        else if(sel instanceof Object[]) encode = "A:" + StringUtil.joinStringArray((Object[]) sel, ",");
                        else                             encode = "o:" + sel;
                        jsonGenerator.writeString(encode);
                    }
                    jsonGenerator.writeEndArray();
                }
                jsonGenerator.writeEndArray();
            }
        }
    }
}
