package com.devteam.core.util.avatar;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import javax.imageio.ImageIO;

import com.devteam.core.util.error.ErrorType;
import com.devteam.core.util.error.RuntimeError;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

public class AvatarUtil {

    private static LoadingCache<String, Color> colorsCache =
            CacheBuilder.newBuilder().maximumSize(500)
                    .expireAfterAccess(InitialsConstants.CACHE_EXP_IN_SECS, TimeUnit.SECONDS)
                    .build(new CacheLoader<String, Color>() {
                        @Override
                        public Color load(final String key) {
                            return new Color(ColorHelper.getRandomClearColorInt(key));
                        }
                    });

    static String getInitials(String name) {
        String[] token = name.trim().split(" ");
        int maxLength = token.length; ;
        if(maxLength > 2) maxLength = 2;
        StringBuilder b = new StringBuilder() ;
        for(int i = 0; i < maxLength; i++) {
            if(token[i].length() == 0) continue;
            b.append(Character.toUpperCase(token[i].charAt(0)));
        }
        if(b.length() == 0) return "?" ;
        return b.toString();
    }

    public static BufferedImage create(int width, int height, String name) throws IOException {
        String initial = getInitials(name);
        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = img.createGraphics();

        // Rectangle of random color
        final Rectangle2D.Double rectangle = new Rectangle2D.Double(0, 0, width, height);
        g2.setPaint(colorsCache.getUnchecked(name));
        g2.fill(rectangle);

        // Antialiassing
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Font scale
        final int fontSize = Math.round((Math.min(width, height) * InitialsConstants.BIG_FONT_FACTOR));
        final Font font = new Font(Font.SANS_SERIF, Font.PLAIN, fontSize);
        g2.setFont(font);
        final FontMetrics fm = g2.getFontMetrics();
        final float fontSizeLast = width / (float) fm.stringWidth(initial) * fontSize;
        font.deriveFont(fontSizeLast);

        // Font color
        g2.setColor(Color.WHITE);

        // Center font
        final Rectangle2D fontRect = fm.getStringBounds(initial, g2);
        final int x = (width - (int) fontRect.getWidth()) / 2;
        final int y = (height - (int) fontRect.getHeight()) / 2 + fm.getAscent();

        // Draw font
        g2.drawString(initial, x, y);
        return img;
    }

    public static byte[] createPngAsBytes(int width, int height, String fullName) {
        try {
            BufferedImage img = create(width, height, fullName);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ImageIO.write(img, "png", out);
            return out.toByteArray();
        } catch(IOException ex) {
            throw new RuntimeError(ErrorType.IllegalState, "Error convert bytes", ex);
        }
    }

    public static byte[] toPng(File file) {
        try {
            BufferedImage image = ImageIO.read(file);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ImageIO.write(image, "png", out);
            return out.toByteArray();
        } catch(IOException ex) {
            throw new RuntimeError(ErrorType.IllegalState, "Error convert bytes", ex);
        }
    }

    public static byte[] toPng(byte[] imgData) {
        try {
            ByteArrayInputStream is = new ByteArrayInputStream(imgData);
            BufferedImage image = ImageIO.read(is);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ImageIO.write(image, "png", out);
            return out.toByteArray();
        } catch(IOException ex) {
            throw new RuntimeError(ErrorType.IllegalState, "Error convert bytes", ex);
        }
    }
}