package com.devteam.core.util.avatar;

public class RandomHelper {

    private static ColorRandom random;

    private static int getFromRange(final int min, final int max, final double random) {
        return min + (int) (random * ((max - min) + 1));
    }

    public static int getInt(final int min, final int max) {
        final double random = Math.random();
        return getFromRange(min, max, random);
    }

    public static int getRandomInt(final int min, final int max) {
        if (random == null) {
            random = new ColorRandom();
            random.setSeed("", 0);
        }
        return getFromRange(min, max, random.nextDouble());
    }

    /**
     * Sets the random generator seed. We need to generate a random color for some
     * username but should be the same in the server and client side, and also
     * should be variable in the time. So we use the seed for that.
     *
     * @param name
     *          the name
     * @param seed
     *          the seed
     */
    public static void setSeed(final String name, final int seed) {
        if (random == null) {
            random = new ColorRandom();
        }
        random.setSeed(name, seed);
    }

}


