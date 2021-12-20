package com.devteam.module.storage.config;

import com.devteam.core.module.data.CoreDataModuleConfig;
import com.devteam.core.module.srpingframework.config.ModuleConfig;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@ModuleConfig(
  basePackages= { "com.devteam.module.storage" }
)
@Configuration
@ComponentScan(basePackages = { "com.devteam.module.storage" })
@EnableJpaRepositories(
  basePackages = { "com.devteam.module.storage.repository" }
)
@EnableConfigurationProperties
@EnableTransactionManagement
@Import({CoreDataModuleConfig.class})
public class StorageModuleConfig {
}