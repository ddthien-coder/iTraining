package com.devteam.util.jvm;


import com.devteam.core.util.dataformat.DataSerializer;
import com.devteam.core.util.jvm.JVMInfo;
import org.junit.jupiter.api.Test;

public class JVMInfoUnitTest {
  @Test
  public void test() {
    JVMInfo jvmInfo = new JVMInfo().init();
    System.out.println(DataSerializer.JSON.toString(jvmInfo.getMemoryInfo()));
  }
}
