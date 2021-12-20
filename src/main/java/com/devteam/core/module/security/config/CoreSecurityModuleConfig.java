package com.devteam.core.module.security.config;

import com.devteam.core.module.srpingframework.config.ModuleConfig;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@ModuleConfig(basePackages = { "com.devteam.core.module.security" })
@Configuration
@ComponentScan(basePackages = { "com.devteam.core.module.security" })
@EnableJpaRepositories(
  basePackages = {"com.devteam.core.module.security.repository"}
  )
@EnableConfigurationProperties
@EnableTransactionManagement

public class CoreSecurityModuleConfig {
}