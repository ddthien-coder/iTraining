package com.devteam.core.util.io;

import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.CharArrayWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Reader;
import java.net.URL;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;



public class IOUtil {

  static public URL getResource(String res) throws IOException {
    if (res.startsWith("file:")) {
      File file = new File(res.substring("file:".length()));
      if(!file.exists()) return null;
      return file.toURI().toURL();
    } else if (res.startsWith("classpath:")) {
      res = res.substring("classpath:".length());
      URL url =  Thread.currentThread().getContextClassLoader().getResource(res);
      return url ;
    } else {
      return Thread.currentThread().getContextClassLoader().getResource(res);
    }
  }

  static public boolean hasResource(String res) throws IOException {
    return getResource(res) != null;
  }
  
  static public URL findURL(String res) throws IOException {
    if (res.startsWith("file:")) {
      return new File(res.substring("file:".length())).toURI().toURL();
    } else if (res.startsWith("classpath:")) {
      res = res.substring("classpath:".length());
      return Thread.currentThread().getContextClassLoader().getResource(res);
    } else {
      return Thread.currentThread().getContextClassLoader().getResource(res);
    }
  }
  
  static public InputStream loadResource(String res) throws IOException {
    URL url = getResource(res);
    if(url == null) return null;
    return url.openStream();
  }
  
  static public String loadResourceAsString(String res) throws IOException {
    InputStream is = loadResource(res) ;
    return getStreamContentAsString(is, "UTF-8") ;
  }
  
  static public String loadResourceAsString(String res, String encoding) throws IOException {
    InputStream is = loadResource(res) ;
    return getStreamContentAsString(is, encoding) ;
  }
  
  static public String getFileContentAsString(File file, String encoding) throws Exception {
    FileInputStream is = new FileInputStream(file);
    return new String(getStreamContentAsBytes(is), encoding);
  }

  static public String getFileContentAsString(File file) throws Exception {
    FileInputStream is = new FileInputStream(file);
    return new String(getStreamContentAsBytes(is));
  }

  static public String getFileContentAsString(String fileName, String encoding) throws Exception {
    if (fileName == null)
      return null;
    FileInputStream is = new FileInputStream(fileName);
    return new String(getStreamContentAsBytes(is), encoding);
  }

  static public String getFileContentAsString(String fileName) throws Exception {
    FileInputStream is = new FileInputStream(fileName);
    String data = new String(getStreamContentAsBytes(is));
    is.close();
    return data;
  }
  
  static public byte[] getFileContentAsBytes(File file) throws Exception {
    FileInputStream is = new FileInputStream(file);
    byte[] data = getStreamContentAsBytes(is);
    is.close();
    return data;
  }

  static public byte[] getFileContentAsBytes(String fileName) throws Exception {
    FileInputStream is = new FileInputStream(fileName);
    byte[] data = getStreamContentAsBytes(is);
    is.close();
    return data;
  }

  static public String getStreamContentAsString(InputStream is, String encoding) throws IOException {
    return new String(getStreamContentAsBytes(is), encoding);
  }

  static public String getStreamContentAsString(Reader in) throws IOException {
    char[] data = new char[4912];
    int available = -1;
    StringBuilder b = new StringBuilder();
    while ((available = in.read(data)) > -1) {
      b.append(data, 0, available);
    }
    return b.toString();
  }

  static public byte[] getStreamContentAsBytes(InputStream is) {
    try {
      BufferedInputStream buffer = new BufferedInputStream(is);
      ByteArrayOutputStream output = new ByteArrayOutputStream();
      byte[] data = new byte[4912];
      int available = -1;
      while ((available = buffer.read(data)) > -1) {
        output.write(data, 0, available);
      }
      is.close();
      return output.toByteArray();
    } catch(IOException ex) {
      throw new RuntimeError(ErrorType.IllegalArgument, "Cannot convert input stream", ex);
    }
  }

  static public char[] getCharacters(Reader reader) throws IOException {
    CharArrayWriter writer = new CharArrayWriter(4912);
    char[] data = new char[4912];
    int available = -1;
    while ((available = reader.read(data)) > -1) {
      writer.write(data, 0, available);
    }
    reader.close();
    writer.close();
    return writer.toCharArray();
  }

  static public byte[] getStreamContentAsBytes(InputStream is, int maxRead) throws IOException {
    BufferedInputStream buffer = new BufferedInputStream(is);
    ByteArrayOutputStream output = new ByteArrayOutputStream();
    byte[] data = new byte[4912];
    int available = -1, read = 0;
    while ((available = buffer.read(data)) > -1 && read < maxRead) {
      if (maxRead - read < available) available = maxRead - read;
      output.write(data, 0, available);
      read += available;
    }
    is.close();
    return output.toByteArray();
  }

  static public String getResourceAsString(String resource, String encoding) throws Exception {
    ClassLoader cl = Thread.currentThread().getContextClassLoader();
    URL url = cl.getResource(resource);
    InputStream is = url.openStream();
    String data = getStreamContentAsString(is, encoding);
    is.close();
    return data;
  }

  static public byte[] getResourceAsBytes(String resource) throws Exception {
    ClassLoader cl = Thread.currentThread().getContextClassLoader();
    URL url = cl.getResource(resource);
    InputStream is = url.openStream();
    byte[] data = getStreamContentAsBytes(is);
    is.close();
    return data;
  }

  static public void save(String data, String file) throws IOException {
    FileOutputStream os = new FileOutputStream(file);
    byte[] buf = data.getBytes();
    os.write(buf);
    os.close();
  }
  
  static public void save(String data, String encoding, String file) throws IOException {
    FileOutputStream os = new FileOutputStream(file);
    byte[] buf = data.getBytes(encoding);
    os.write(buf);
    os.close();
  }
  
  static public void save(File file, byte[] data) throws IOException {
    FileOutputStream os = new FileOutputStream(file);
    os.write(data);
    os.close();
  }

  static public byte[] serialize(Object obj) throws IOException {
    ByteArrayOutputStream bytes = new ByteArrayOutputStream();
    ObjectOutputStream out = new ObjectOutputStream(bytes);
    out.writeObject(obj);
    out.close();
    byte[] ret = bytes.toByteArray();
    return ret;
  }

  static public Object deserialize(byte[] bytes) throws Exception {
    if (bytes == null) return null;
    ByteArrayInputStream is = new ByteArrayInputStream(bytes);
    ObjectInputStream in = new ObjectInputStream(is);
    Object obj = in.readObject();
    in.close();
    return obj;
  }
  
  static public byte[] compress(byte[] data) throws IOException {  
    Deflater deflater = new Deflater();  
    deflater.setInput(data);  
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);   
    deflater.finish();  
    byte[] buffer = new byte[1024];   
    while (!deflater.finished()) {  
     int count = deflater.deflate(buffer); // returns the generated code... index  
     outputStream.write(buffer, 0, count);   
    }  
    outputStream.close();  
    byte[] output = outputStream.toByteArray();  
    return output;  
   }  

  static public byte[] decompress(byte[] data) throws IOException, DataFormatException {  
    Inflater inflater = new Inflater();   
    inflater.setInput(data);  
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);  
    byte[] buffer = new byte[1024];  
    while (!inflater.finished()) {  
     int count = inflater.inflate(buffer);  
     outputStream.write(buffer, 0, count);  
    }  
    outputStream.close();  
    byte[] output = outputStream.toByteArray();  
    return output;  
   }
  
}