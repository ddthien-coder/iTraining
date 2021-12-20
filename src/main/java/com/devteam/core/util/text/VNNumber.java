package com.devteam.core.util.text;

import java.util.HashMap;
import java.util.Map;

public class VNNumber {
  static Map<Long, String> numbers = new HashMap<>();
  static {
    numbers.put(0l, "không");
    numbers.put(1l, "một");
    numbers.put(2l, "hai");
    numbers.put(3l, "ba");
    numbers.put(4l, "bốn");
    numbers.put(5l, "năm");
    numbers.put(6l, "sáu");
    numbers.put(7l, "bảy");
    numbers.put(8l, "tám");
    numbers.put(9l, "chín");
  }
  
  static public String format(long number) {
    StringBuilder b = new StringBuilder();
    addB(b, number);
    String string = b.toString();
    if(string.length() > 0) {
      string = string.substring(0,1).toUpperCase() + string.substring(1).toLowerCase();
    }
    return string;
  }
  
  static void addB(StringBuilder b, long num) {
    long remain = num;
    if(num >= 1000000000) {
      addM(b, num/1000000000);
      remain = num % 1000000000;
      b.append(" tỷ ");
    }
    addM(b, remain);
  }
  
  static void addM(StringBuilder b, long num) {
    long remain = num;
    if(num >= 1000000) {
      addK(b, num/1000000);
      remain = num % 1000000;
      b.append(" triệu ");
    }
    addK(b, remain);
  }
  
  static void addK(StringBuilder b, long num) {
    long remain = num;
    if(num >= 1000) {
      addH(b, num/1000);
      remain = num % 1000;
      b.append(" nghìn ");
    }
    addH(b, remain);
  }
  
  static void addH(StringBuilder b, long num) {
    long remain = num;
    if(num >= 100) {
      addD(b, num/100, 0);
      remain = num % 100;
      b.append(" trăm ");
    }
    addD(b, remain, num/100);
  }
  
  static void addD(StringBuilder b, long num, long h) {
    long remain = num;
    long dNum   = -1l;
    if(num >= 10) {
      dNum = num/10;
      if(dNum > 1) {
        addU(b, dNum);
        b.append(" mươi ");
      } else {
        b.append("mười ");
      }
      remain = num % 10;
    } else if(num < 10 && num > 0 && h > 0) {
      b.append(" linh ");
    }
    if(remain > 0) {
      if(dNum > 1 && remain == 1) b.append(" mốt ");
      else addU(b, remain);
    }
  }
  
  static void addU(StringBuilder b, long num) {

    String numString = numbers.get(num);
    b.append(numString);
  }
}
