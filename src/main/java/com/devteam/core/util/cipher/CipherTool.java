package com.devteam.core.util.cipher;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

public class CipherTool {
  static long   DAY_IN_MS         = 24 * 60 * 60 * 1000;
  static String KEY_ALGORITHM     = "AES";
  static int    KEY_SIZE_BITS     = 128;
  static String ENCRYPT_ALGORITHM = "AES/CBC/PKCS5Padding";

  static String SECRET_KEY_FACTORY_ALGORITHM = "PBKDF2WithHmacSHA1";
  static int    PWD_ITERATIONS               = 65536;
  static int    TOKEN_KEY_SIZE_BITS          = 256;
  static String SALT                         = "ahaysoft";

  static public String encrypt(String token, String str) throws Exception {
    Cipher cipher = createCipher(token, Cipher.ENCRYPT_MODE);

    //Encode the string into bytes using utf-8
    byte[] utf8 = str.getBytes("UTF-8");
    byte[] enc = cipher.doFinal(utf8);
    // Encode bytes to base64 to get a string
    return Base64.getEncoder().encodeToString(enc);
  }

  static public String decrypt(String token, String str) throws Exception {
    //decrypt the message
    Cipher cipher = createCipher(token, Cipher.DECRYPT_MODE);

    byte[] dec = Base64.getDecoder().decode(str);
    byte[] utf8 = cipher.doFinal(dec);
    return new String(utf8, "UTF-8");
  }

  static private Cipher createCipher(String token, int mode) throws Exception {
    byte[] saltBytes = SALT.getBytes("UTF-8");
    SecretKeyFactory skf = SecretKeyFactory.getInstance(SECRET_KEY_FACTORY_ALGORITHM);
    PBEKeySpec spec = new PBEKeySpec(token.toCharArray(), saltBytes, PWD_ITERATIONS, TOKEN_KEY_SIZE_BITS);
    SecretKey secretKey = skf.generateSecret(spec);
    SecretKeySpec key = new SecretKeySpec(secretKey.getEncoded(), KEY_ALGORITHM);

    //decrypt the message
    Cipher cipher = Cipher.getInstance(ENCRYPT_ALGORITHM);
    byte[] ivBytes = new byte[KEY_SIZE_BITS/8];
    cipher.init(mode, key, new IvParameterSpec(ivBytes));
    return cipher;
  }
}
