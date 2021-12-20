package com.devteam.core.module.srpingframework.config;

import com.devteam.core.module.srpingframework.app.AppEnv;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.scheduling.annotation.EnableScheduling;



@ModuleConfig( basePackages = { "com.devteam.core.module.app" })
@Configuration
@ComponentScan( basePackageClasses = { AppEnv.class })
@EnableScheduling
@EnableConfigurationProperties
public class SpringFrameworkModuleConfig {
  @Bean
  public static PropertySourcesPlaceholderConfigurer propertiesResolver() {
    return new PropertySourcesPlaceholderConfigurer();
  }
}
