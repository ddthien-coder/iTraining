package com.devteam.core.db;

import com.devteam.util.TestConfig;
import com.devteam.core.module.data.db.plugin.repository.PluginInfoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;


public class RepositoryUnitTest extends TestConfig {
  @Autowired
  PluginInfoRepository pluginRepo;

  @BeforeEach
  public void setup() throws Exception {
  }

  @Test
  public void testRepository() throws Exception {
    System.out.println("test...........");
  }

}