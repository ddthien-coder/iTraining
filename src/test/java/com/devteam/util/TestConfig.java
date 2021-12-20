package com.devteam.util;

import com.devteam.config.JpaConfiguration;
import com.devteam.core.module.common.ClientInfo;
import com.devteam.core.module.data.CoreDataModuleConfig;
import com.devteam.core.module.data.db.sample.EntityDB;
import com.devteam.core.module.security.config.CoreSecurityModuleConfig;
import com.devteam.core.module.srpingframework.config.SpringFrameworkModuleConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;


@ExtendWith(SpringExtension.class)
@SpringBootTest(
  properties = {
    "spring.config.location=classpath:application-test.yaml",
    "spring.datasource.hibernate.show_sql=false"
  },
  classes = {  CoreDataModuleConfig.class,  JpaConfiguration.class, SpringFrameworkModuleConfig.class, CoreSecurityModuleConfig.class }
)
@EnableAutoConfiguration(
  exclude= { DataSourceAutoConfiguration.class, SecurityAutoConfiguration.class}
)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
abstract public class TestConfig {
  
  protected ClientInfo clientInfo = ClientInfo.DEFAULT;
  
  @Autowired
  protected ApplicationContext context;

  @BeforeEach
  public void clearDataDB() throws Exception {
    EntityDB.initDataDB(context);
  }
}
