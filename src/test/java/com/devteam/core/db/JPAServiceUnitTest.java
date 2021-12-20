package com.devteam.core.db;

import java.util.List;

import com.devteam.util.TestConfig;
import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.db.EntityInfo;
import com.devteam.core.module.data.db.JPAService;
import com.devteam.core.util.dataformat.DataSerializer;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class JPAServiceUnitTest extends TestConfig {
  @Autowired
  private JPAService service;

  @Test @Tag("unit")
  public void test() {
    List<EntityInfo> entities = service.getEntityInfos(ClientInfo.DEFAULT);

    for(EntityInfo sel : entities) {
      System.out.println(DataSerializer.JSON.toString(sel));
    }
  }
}
