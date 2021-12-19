package com.ddthien.itraining.lib.util;

import java.text.DecimalFormat;

public class TextUtil {
    static public DecimalFormat NUMBER_FORMATER   = new DecimalFormat("#.##");
    static public DecimalFormat PERCENT_FORMATER  = new DecimalFormat("#.##%");
    static public DecimalFormat CURRENCY_FORMATER = new DecimalFormat("#,##0.##");

    static public String asHummanReadableBytes(long number) {
        if (number == 0) return "0";
        String suffix = "Bytes";
        String value = null;

        if (number > 1024 * 1024 * 1024l) {
            suffix = "GB";
            value = Double.toString(Math.round(number / (1024 * 1024 * 1024l)));
        } else if (number > 1024 * 1024l) {
            suffix = "MB";
            value = Double.toString(Math.round(number / (1024 * 1024l)));
        } else if (number > 1024l) {
            suffix = "KB";
            value = Double.toString(Math.round(number / 1024l));
        } else {
            value = Long.toString(number);
        }
        return value + "(" + suffix + ")";
    }


    static public String asHummanReadableMilliSec(long timeInMs) { return DateUtil.asHumanReadable(timeInMs); }

    static public String asHummanReadablePercent(double number) { return PERCENT_FORMATER.format(number * 100); }

    static public String asHummanReadableDouble(double number) { return NUMBER_FORMATER.format(number); }

    static public String asHummanReadableCurrency(double number) { return CURRENCY_FORMATER.format(number); }
}

