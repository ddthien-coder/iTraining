package com.ddthien.itraining.lib.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {
    final static public SimpleDateFormat TIME                        = new SimpleDateFormat("HH:mm:ss");

    final static public SimpleDateFormat COMPACT_DATE                = new SimpleDateFormat("dd/MM/yyyy");
    final static public SimpleDateFormat COMPACT_DATE_WITH_DASH      = new SimpleDateFormat("dd-MM-yyyy");
    final static public SimpleDateFormat COMPACT_DATE_ID             = new SimpleDateFormat("yyyyMMdd");

    final static public SimpleDateFormat COMPACT_DATE_TIME           = new SimpleDateFormat("dd/MM/yyyy@HH:mm:ss");
    final static public SimpleDateFormat COMPACT_DATE_TIME_WITH_DASH = new SimpleDateFormat("dd-MM-yyyy@HH:mm:ss");
    final static public SimpleDateFormat COMPACT_DATE_TIME_ID        = new SimpleDateFormat("yyyyMMddHHmmss");

    static public String asTime(Date date) { return TIME.format(date) ; }

    static public String asCompactDate(long time) {
        return COMPACT_DATE.format(new Date(time)) ;
    }

    static public String asCompactDate(Date time) {
        if(time == null) return null;
        return COMPACT_DATE.format(time) ;
    }

    static public String asCompactDateTime(Date date) {
        if(date == null) return null;
        return COMPACT_DATE_TIME.format(date) ;
    }

    static public String asCompactDateId(Date time) {
        return COMPACT_DATE_ID.format(time) ;
    }

    static public String asCompactDate(Calendar cal) {
        return COMPACT_DATE.format(cal.getTime()) ;
    }

    static public Date parseCompactDate(String exp) throws ParseException {
        return COMPACT_DATE.parse(exp) ;
    }

    static public Date parseCompactDateTimeId(String exp) throws ParseException {
        return COMPACT_DATE_TIME_ID.parse(exp) ;
    }

    static public String asCompactDateTimeId(long time) {
        return COMPACT_DATE_TIME_ID.format(new Date(time)) ;
    }

    static public String asCompactDateTimeId(Date date) {
        return COMPACT_DATE_TIME_ID.format(date) ;
    }

    static public Date parseCompactDateTime(String exp) {
        try {
            return COMPACT_DATE_TIME.parse(exp) ;
        } catch (ParseException e) {
            throw new RuntimeException(exp);
        }
    }


    static public Date asCompactDateTimeWithDash(String exp) {
        try {
            return COMPACT_DATE_TIME_WITH_DASH.parse(exp) ;
        } catch (ParseException e) {
            throw new RuntimeException(exp);
        }
    }

    static public Date asCompactDate(String exp) {
        try {
            return COMPACT_DATE.parse(exp) ;
        } catch (ParseException e) {
            throw new RuntimeException(exp);
        }
    }

    static public Date asCompactDateWithDash(String exp) {
        try {
            return COMPACT_DATE_WITH_DASH.parse(exp) ;
        } catch (ParseException e) {
            throw new RuntimeException(exp);
        }
    }


    public static String asCompactDateTime(long startTime) {
        return COMPACT_DATE_TIME.format(new Date(startTime));
    }
}
