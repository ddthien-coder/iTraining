package com.devteam.core.util.text;

import java.util.HashMap;
import java.util.Map;

public class CosineSimilarity {
  final static public CosineSimilarity INSTANCE = new CosineSimilarity() ;

  static char[] TOKEN_SEPARATOR = { ' ', '\t', '\n', '\r'} ;

  public double similarity(String s1, String s2) {
    if(s1 == null) s1 = "" ;
    if(s2 == null) s2 = "" ;
    String[] array1 = StringUtil.splitAsArray(s1, TOKEN_SEPARATOR);
    String[] array2 = StringUtil.splitAsArray(s2, TOKEN_SEPARATOR);
    return similarity(array1, array2) ;
  }

  public double similarity(String[] x, String[] y) {
    double[][] TFVectors = buildTFVectors(x, y);
    double[] TF_X = TFVectors[0];
    double[] TF_Y = TFVectors[1];
    return similarityTFVectors(TF_X, TF_Y);
  }

  public double similarity(int[] vid1, int[] vid2) {
    double[][] TFVectors = buildTFVectors(vid1, vid2);
    double[] TF_X = TFVectors[0];
    double[] TF_Y = TFVectors[1];
    return similarityTFVectors(TF_X, TF_Y);
  }

  private double similarityTFVectors(double[] v1, double[] v2) {
    double a = dotProduct(v1, v2);
    double b = norm(v1) * norm(v2);
    double ret = a / b;
    if(ret > 1.0) ret = 1.0 ;
    return ret ;
  }

  private double dotProduct(double[] v1, double[] v2) {
    double sum = 0.0;
    for (int i = 0, n = v1.length; i < n; i++) {
      sum += v1[i] * v2[i];
    }
    return sum;
  }

  private double norm(double[] v) {
    double sum = 0.0;
    for (int i = 0, n = v.length; i < n; i++) {
      sum += v[i] * v[i];
    }
    return Math.sqrt(sum);
  }

  private double[][] buildTFVectors(String[] x, String[] y) {
    Map<String, Integer> features = new HashMap<String, Integer>();
    for (String s : x) {
      features.put(s, 0x01);
    }
    for (String s : y) {
      if (!features.containsKey(s)) {
        features.put(s, 0x02);
      } else {
        features.put(s, 0x03);
      }
    }

    int n = features.size();
    double[] TF_X = new double[n];
    double[] TF_Y = new double[n];
    int i = 0;
    for (Map.Entry<String, Integer> e : features.entrySet()) {
      int flags = e.getValue();
      TF_X[i] = flags & 0x01;
      TF_Y[i] = flags >> 1;
    i++;
    }
    return new double[][] { TF_X, TF_Y };
  }

  private double[][] buildTFVectors(int[] idx, int[] idy) {
    Map<Integer, Integer> features = new HashMap<Integer, Integer>();
    for (int s : idx) {
      features.put(s, 0x01);
    }
    for (int s : idy) {
      if (!features.containsKey(s)) {
        features.put(s, 0x02);
      } else {
        features.put(s, 0x03);
      }
    }

    int n = features.size();
    double[] TF_X = new double[n];
    double[] TF_Y = new double[n];
    int i = 0;
    for (Map.Entry<Integer, Integer> e : features.entrySet()) {
      int flags = e.getValue();
      TF_X[i] = flags & 0x01;
      TF_Y[i] = flags >> 1;
      i++;
    }
    return new double[][] { TF_X, TF_Y };
  }

  static public String[] split(String s1) {
    if(s1 == null) s1 = "" ;
    String[] array1 = StringUtil.splitAsArray(s1, TOKEN_SEPARATOR);
    return array1 ;
  }

  public static void main(String[] args) {
    CosineSimilarity cos = new CosineSimilarity();
  }
}