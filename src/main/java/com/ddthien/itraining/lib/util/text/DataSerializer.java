package com.ddthien.itraining.lib.util.text;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.nio.charset.Charset;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;

public class DataSerializer {
    final static public  Charset UTF8 = Charset.forName("UTF-8") ;
    final static public DateFormat COMPACT_DATE_TIME = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss 'GMT'Z")  ;

    final static public DataSerializer JSON = new DataSerializer(new MappingJsonFactory()) ;

    private ObjectMapper mapper ;

    public DataSerializer(JsonFactory factory) {
        mapper = new ObjectMapper(factory); // can reuse, share globally
        configure(mapper) ;
    }

    public DataSerializer(JsonFactory factory, Module ... module) {
        this(factory) ;
        for(Module selModule : module) {
            mapper.registerModule(selModule);
        }
    }

    public void setIgnoreUnknownProperty(boolean b) {
    }

    public <T> byte[] toBytes(T idoc)  {
        try {
            ByteArrayOutputStream outStream = new ByteArrayOutputStream();
            OutputStreamWriter writer = new OutputStreamWriter(outStream);
            mapper.writeValue(writer, idoc);
            writer.close() ;
            return outStream.toByteArray() ;
        } catch(IOException e) {
            throw new RuntimeException(e) ;
        }
    }

    public <T> T fromJsonNode(JsonNode node, Class<T> type)  {
        try {
            return mapper.treeToValue(node, type);
        } catch (IOException e) {
            throw new RuntimeException(e) ;
        }
    }


    public <T> T fromJsonNode(JsonNode node, TypeReference<T> tref)  {
        return mapper.convertValue(node, tref);
    }

    public <T> List<T> fromJsonNodeToList(JsonNode node, TypeReference<List<T>> tref)  {
        return mapper.convertValue(node, tref);
    }

    public <T> T fromBytes(byte[] data, Class<T> type)  {
        try {
            ByteArrayInputStream inStream = new ByteArrayInputStream(data);
            Reader reader  = new InputStreamReader(inStream);
            return mapper.readValue(reader , type);
        } catch (IOException e) {
            throw new RuntimeException(e) ;
        }
    }

    public <T> T fromBytes(byte[] data, TypeReference<T> typeRef) {
        try {
            ByteArrayInputStream inStream = new ByteArrayInputStream(data);
            Reader reader  = new InputStreamReader(inStream);
            return mapper.readValue(reader , typeRef);
        } catch (IOException e) {
            throw new RuntimeException(e) ;
        }
    }

    public <T> String toString(T idoc) {
        if(idoc == null) return "" ;
        try  {
            StringWriter writer = new StringWriter() ;
            ObjectWriter owriter  = mapper.writerWithDefaultPrettyPrinter() ;
            owriter.writeValue(writer, idoc);
            return writer.toString() ;
        } catch(IOException ex) {
            throw new RuntimeException(ex) ;
        }
    }

    public <T> T fromString(String data, Class<T> type) {
        try {
            StringReader reader = new StringReader(data) ;
            return mapper.readValue(reader , type);
        } catch (IOException e) {
            throw new RuntimeException(e) ;
        }
    }

    public <T> JsonNode toJsonNode(T idoc) throws IOException {
        return mapper.convertValue(idoc, JsonNode.class) ;
    }

    public  String toString(JsonNode node) throws IOException {
        StringWriter writer = new StringWriter() ;
        ObjectWriter owriter  = mapper.writerWithDefaultPrettyPrinter() ;
        owriter.writeValue(writer, node);
        return writer.toString() ;
    }

    public <T> T fromString(String data, TypeReference<T> typeRef) {
        try {
            StringReader reader = new StringReader(data) ;
            return mapper.readValue(reader , typeRef);
        } catch (IOException e) {
            throw new RuntimeException(e) ;
        }
    }

    public JsonNode fromString(String data) throws IOException {
        StringReader reader = new StringReader(data) ;
        return mapper.readTree(reader);
    }

    public <T> T clone(T obj) {
        try  {
            Writer writer = new StringWriter() ;
            ObjectWriter owriter  = mapper.writerWithDefaultPrettyPrinter() ;
            owriter.writeValue(writer, obj);
            String json =  writer.toString() ;
            return (T) fromString(json, obj.getClass()) ;
        } catch(IOException ex) {
            throw new RuntimeException(ex) ;
        }
    }

    static public class GenericTypeDeserializer extends JsonDeserializer<Object> {
        public Object deserialize(JsonParser jsonParser, DeserializationContext ctx) throws IOException {
            ObjectCodec oc = jsonParser.getCodec();
            JsonNode node = oc.readTree(jsonParser);
            String resultType = node.get("type").asText();
            try {
                Class type = Class.forName(resultType)  ;
                JsonNode rnode = node.get("data") ;
                Object val = oc.treeToValue(rnode, type);
                return val ;
            } catch (ClassNotFoundException e) {
                throw new IOException(e) ;
            }
        }
    }

    static public class GenericTypeSerializer extends JsonSerializer<Object> {
        public  void serialize(Object resutl, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
            jsonGenerator.writeStartObject();
            jsonGenerator.writeObjectField("type", resutl.getClass().getName());
            jsonGenerator.writeObjectField("data", resutl);
            jsonGenerator.writeEndObject();
        }
    }

    static public void configure(ObjectMapper mapper) {
        mapper.configure(JsonParser.Feature.AUTO_CLOSE_SOURCE, false) ;
        mapper.setDateFormat(COMPACT_DATE_TIME) ;
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
    }
}
