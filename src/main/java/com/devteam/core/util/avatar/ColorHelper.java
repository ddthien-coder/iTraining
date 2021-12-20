package com.devteam.core.util.avatar;

/**
 * The Class InitialsColorHelper.
 *
 * @author vjrj@ourproject.org (Vicente J. Ruiz Jurado)
 */
public class ColorHelper {

    /** The MAX color constant. */
    public static final int MAX = 200;

    /** The MIN color constant. */

    public static final int MIN = 80;

    /**
     * Gets a random clear color suitable for use in placeholder avatars, using a
     * string (and the current hour) as seed
     *
     * Inspired in <a href=
     * "https://github.com/lmoffereins/initials-default-avatar/blob/master/initials-default-avatar.php"
     * >this</a>.
     *
     * @return the random
     */
    public static String getRandomClearColor(final String seedString) {
        // This should return a random but clear color for an initial avatar
        final int red = getRandomInt(seedString, -1);
        final int green = getRandomInt(seedString, 5);
        final int blue = getRandomInt(seedString, 2);
        return rgbToHex(red, green, blue);
    }

    /**
     * Gets a random clear color suitable for use in placeholder avatars, using a
     * string (and the current hour) as seed
     *
     * Inspired in <a href=
     * "https://github.com/lmoffereins/initials-default-avatar/blob/master/initials-default-avatar.php"
     * >this</a>.
     *
     * @return the random
     */
    public static int getRandomClearColorInt(final String seedString) {
        final int red = getRandomInt(seedString, -1);
        final int green = getRandomInt(seedString, 5);
        final int blue = getRandomInt(seedString, 2);
        // http://stackoverflow.com/questions/4801366/convert-rgb-values-into-integer-pixel
        final int rgb = ((red & 0x0ff) << 16) | ((green & 0x0ff) << 8) | (blue & 0x0ff);
        return rgb;
    }

    /**
     * Gets the random int using the current date (without minutes) and a string
     * as seed. This should allow to generate the same random values in client and
     * server side.
     *
     * @param name
     *          the string seed
     * @return the random int generated from the seed
     */
    private static int getRandomInt(final String seedString, final int seed) {
        RandomHelper.setSeed(seedString, seed);
        return RandomHelper.getRandomInt(MIN, MAX);
    }

    /**
     * RGB to hex based in <a
     * href="http://stackoverflow.com/questions/15403471/use-color-class-in-gwt"
     * >this</a>
     *
     * @param r
     *          the red
     * @param g
     *          the green
     * @param b
     *          the blue
     * @return the color string
     */
    public static String rgbToHex(final int r, final int g, final int b) {
        final StringBuilder sb = new StringBuilder();
        sb.append('#').append(Integer.toHexString(r)).append(Integer.toHexString(g)).append(
                Integer.toHexString(b));
        return sb.toString();
    }

    /**
     * Instantiates a new color helper.
     */
    public ColorHelper() {
    }
}

