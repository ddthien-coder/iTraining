package com.devteam.core.util.text;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;

public class DateUtil {
  final static public String DEFAULT_TIMEZONE_ID     = "Asia/Ho_Chi_Minh";
  final static public String LOCAL_DATETIME_FORMAT   = "dd/MM/yyyy@HH:mm:ss";  // sample 31/07/2020@11:26:07
  final static public String COMPACT_DATETIME_FORMAT = "dd/MM/yyyy@HH:mm:ssZ"; // sample 31/07/2020@11:26:07+0700

  static public DecimalFormat NUMBER_FORMATER   = new DecimalFormat("#.##");
  
  final static public SimpleDateFormat TIME_WITHOUT_SECOND        = new SimpleDateFormat("HH:mm");
  final static public SimpleDateFormat TIME                       = new SimpleDateFormat("HH:mm:ss");
  final static public SimpleDateFormat COMPACT_DATE               = new SimpleDateFormat("dd/MM/yyyy");
  final static public SimpleDateFormat COMPACT_DATE_ID            = new SimpleDateFormat("yyyyMMdd");
  final static public SimpleDateFormat COMPACT_MONTH              = new SimpleDateFormat("MM/yyyy");
  final static public SimpleDateFormat COMPACT_MONTH_ID           = new SimpleDateFormat("yyyyMM");
  final static public SimpleDateFormat ICT_DATE_TIME              = new SimpleDateFormat("E MMM dd HH:mm:ss Z yyyy"); // Mon Jun 18 00:00:00 IST 2021

  private static final ThreadLocal<SimpleDateFormat> LOCAL_DATETIME = new ThreadLocal<SimpleDateFormat>() {
    @Override 
    protected SimpleDateFormat initialValue() {
      return new SimpleDateFormat(LOCAL_DATETIME_FORMAT);
    }
  };
  
  private static final ThreadLocal<SimpleDateFormat> COMPACT_DATETIME = new ThreadLocal<SimpleDateFormat>() {
    @Override 
    protected SimpleDateFormat initialValue() {
      return new SimpleDateFormat(COMPACT_DATETIME_FORMAT);
    }
  };

  final static public SimpleDateFormat COMPACT_DATETIME_ID       = new SimpleDateFormat("yyyyMMddHHmmss");
  final static public SimpleDateFormat COMPACT_MICRO_DATETIME_ID = new SimpleDateFormat("yyyyMMddHHmmssSSS");

  static public String asCompactDate(long time) { return COMPACT_DATE.format(new Date(time)) ; }

  static public String asCompactDate(Date time) {
    if(time == null) return null;
    return COMPACT_DATE.format(time) ;
  }

  static public String asCompactDateTime(Date date) { 
    if(date == null) return null;
    return COMPACT_DATETIME.get().format(date) ; 
  }

  static public String asLocalDateTime(Date date) { 
    if(date == null) return null;
    return LOCAL_DATETIME.get().format(date) ; 
  }
  
  static public String asCompactTimeWithoutSecond(Date date) { return TIME_WITHOUT_SECOND.format(date); }
  
  static public String asCompactTime(Date date) { return TIME.format(date); }
  
  static public String asCompactDate(Calendar cal) { return COMPACT_DATE.format(cal.getTime()) ; }
  
  static public String asCompactMonth(Date time) { return COMPACT_MONTH.format(time) ; }

  static public String asCompactMonthId(Date time) { return COMPACT_MONTH_ID.format(time) ; }

  static public String asCompactDateId(Date time) { return COMPACT_DATE_ID.format(time) ; }
  
  static public String asCompactDateTimeId(Date time) { return COMPACT_DATETIME_ID.format(time) ; }
  
  static public String asCompactMicroDateTimeId(Date time) { return COMPACT_MICRO_DATETIME_ID.format(time) ; }
  
  static public Date parseCompactDateTime(String exp) {
    try {
      if(StringUtil.isEmpty(exp)) return null;
      return COMPACT_DATETIME.get().parse(exp) ;
    } catch (ParseException e) {
      throw new RuntimeException(exp);
    }
  }

  static public Date parseLocalDateTime(String exp) {
    try {
      if(StringUtil.isEmpty(exp)) return null;
      return LOCAL_DATETIME.get().parse(exp) ;
    } catch (ParseException e) {
      throw new RuntimeException(exp);
    }
  }
  
  static public Date parseCompactDate(String exp) {
    try {
      return COMPACT_DATE.parse(exp) ;
    } catch (ParseException e) {
      throw new RuntimeException(exp);
    }
  }

  public static String asCompactDateTime(long startTime) {
    return COMPACT_DATETIME.get().format(new Date(startTime));
  }

  public static boolean isCompactDateFormat(String exp) {
    if(StringUtil.isEmpty(exp)) return false;
    try {
      COMPACT_DATE.parse(exp);
      return true;
    } catch (ParseException e) {
      return false;
    } 
  }
  
  public static boolean isCompactDateTimeFormat(String exp) {
    if(StringUtil.isEmpty(exp)) return false;
    try {
      COMPACT_DATETIME.get().parse(exp);
      return true;
    } catch (ParseException e) {
      return false;
    } 
  }

  static public String asHumanReadable(long timeInMs) {
    if(timeInMs > (60 * 60 * 1000l)) {
      return NUMBER_FORMATER.format((double) timeInMs / (60 * 60 * 1000l)) + " h";
    } else if (timeInMs > 60 * 1000l) {
      return NUMBER_FORMATER.format((double) timeInMs / (60 * 1000l)) + " m";
    } else if (timeInMs > 1000l) {
      return NUMBER_FORMATER.format((double) timeInMs / 1000l) + " s";
    } else {
      return timeInMs + " ms";
    }
  }
  
  static public class DateRandomizer {
    private Random random = new Random();
    private Date   from;
    private Date   to;
    private long   range;
    
    public DateRandomizer(String dateFromExp, String dateToExp) {
      from = parse(dateFromExp);
      if(dateToExp != null) to = parse(dateToExp);
      else to = new Date();
      range = to.getTime() - from.getTime();
    }
    
    public Date next() {
      long num = (long)Math.floor(random.nextDouble() * range);
      return new Date(from.getTime() + num);
    }
    
    private Date parse(String exp) { return DateUtil.parseCompactDate(exp); }
  }
}
