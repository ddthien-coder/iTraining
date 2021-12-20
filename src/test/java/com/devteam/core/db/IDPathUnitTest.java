package com.devteam.core.db;

import com.devteam.core.module.data.db.entity.IDPath;
import com.devteam.core.util.ds.AssertTool;
import org.junit.jupiter.api.Test;


public class IDPathUnitTest {
  @Test
  public void testIDPath() {
    IDPath idPath = new IDPath("proj[1]:subproj[1]:/1/2/3");
    AssertTool.assertEquals(Long.valueOf(3), idPath.getId());
    AssertTool.assertEquals("proj[1]:subproj[1]:/1/2", idPath.getParentPath());
    AssertTool.assertArrayEquals(new String[] {"proj[1]:subproj[1]:/1", "proj[1]:subproj[1]:/1/2"}, idPath.getAncestorPath());
    AssertTool.assertArrayEquals(new String[] {"proj[1]", "subproj[1]"}, idPath.getOwners());

    idPath = new IDPath("proj[1]:subproj[1]:/1");
    AssertTool.assertEquals(Long.valueOf(1), idPath.getId());
    AssertTool.assertEquals(null, idPath.getParentPath());
    AssertTool.assertArrayEquals(null, idPath.getAncestorPath());
    AssertTool.assertArrayEquals(new String[] {"proj[1]", "subproj[1]"}, idPath.getOwners());

    idPath = new IDPath("/1/2/3");
    AssertTool.assertEquals(Long.valueOf(3), idPath.getId());
    AssertTool.assertEquals("/1/2", idPath.getParentPath());
    AssertTool.assertArrayEquals(new String[] {"/1", "/1/2"}, idPath.getAncestorPath());
    AssertTool.assertNull(idPath.getOwners());

    idPath = new IDPath("/1");
    AssertTool.assertEquals(Long.valueOf(1), idPath.getId());
    AssertTool.assertEquals(null, idPath.getParentPath());
    AssertTool.assertArrayEquals(null, idPath.getAncestorPath());
    AssertTool.assertNull(idPath.getOwners());

    idPath = new IDPath("proj[1]:subproj[1]:/1");
    AssertTool.assertEquals(null, idPath.getParentPath());

    idPath = new IDPath("/1");
  }
}
