package com.devteam.core.module.xss;

import com.devteam.core.util.text.StringUtil;

/**
 * Tools for escaping and antisense
 *
 */
public class EscapeUtil
{
    public static final String RE_HTML_MARK = "(<[^<]*?>)|(<[\\s]*?/[^<]*?>)|(<[^<]*?/[\\s ]*?>)";

    private static final char[][] TEXT = new char[64][];

    static
    {
        for (int i = 0; i <64; i++)
        {
            TEXT[i] = new char[] {(char) i };
        }

        // special HTML characters
        TEXT['\''] = "&#039;".toCharArray(); // single quote
        TEXT['"'] = "&#34;".toCharArray(); // single quote
        TEXT['&'] = "&#38;".toCharArray(); // ampersand
        TEXT['<'] = "&#60;".toCharArray(); // less than sign
        TEXT['>'] = "&#62;".toCharArray(); // greater than sign
    }

    /**
     * HTML characters in escaped text are safe characters
     *
     * @param text escaped text
     * @return escaped text
     */
    public static String escape(String text)
    {
        return encode(text);
    }

    /**
     * Restore the escaped HTML special characters
     *
     * @param content HTML content containing escape characters
     * @return converted string
     */
    public static String unescape(String content)
    {
        return decode(content);
    }

    /**
     * Clear all HTML tags, but do not delete the content inside the tags
     *
     * @param content text
     * @return Clear the text after the label
     */
    public static String clean(String content)
    {
        return new HTMLFilter().filter(content);
    }

    /**
     * Escape encoding
     *
     * @param text encoded text
     * @return encoded characters
     */
    private static String encode(String text)
    {
        int len;
        if ((text == null) || ((len = text.length()) == 0))
        {
            return StringUtil.EMPTY;
        }
        StringBuilder buffer = new StringBuilder(len + (len >> 2));
        char c;
        for (int i = 0; i <len; i++)
        {
            c = text.charAt(i);
            if (c <64)
            {
                buffer.append(TEXT[c]);
            }
            else
            {
                buffer.append(c);
            }
        }
        return buffer.toString();
    }

    /**
     * Escape decoding
     *
     * @param content escaped content
     * @return decoded string
     */
    public static String decode(String content)
    {
        if (StringUtil.isEmpty(content))
        {
            return content;
        }

        StringBuilder tmp = new StringBuilder(content.length());
        int lastPos = 0, pos = 0;
        char ch;
        while (lastPos < content.length())
        {
            pos = content.indexOf("%", lastPos);
            if (pos == lastPos)
            {
                if (content.charAt(pos + 1) == 'u')
                {
                    ch = (char) Integer.parseInt(content.substring(pos + 2, pos + 6), 16);
                    tmp.append(ch);
                    lastPos = pos + 6;
                }
                else
                {
                    ch = (char) Integer.parseInt(content.substring(pos + 1, pos + 3), 16);
                    tmp.append(ch);
                    lastPos = pos + 3;
                }
            }
            else
            {
                if (pos == -1)
                {
                    tmp.append(content.substring(lastPos));
                    lastPos = content.length();
                }
                else
                {
                    tmp.append(content.substring(lastPos, pos));
                    lastPos = pos;
                }
            }
        }
        return tmp.toString();
    }

    public static void main(String[] args)
    {
        String html = "<script>alert(1);</script>";
        // String html = "<scr<script>ipt>alert(\"XSS\")</scr<script>ipt>";
        // String html = "<123";
        // String html = "123>";
        System.out.println(EscapeUtil.clean(html));
        System.out.println(EscapeUtil.escape(html));
        System.out.println(EscapeUtil.unescape(html));
    }
}
