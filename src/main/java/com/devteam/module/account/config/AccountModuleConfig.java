package com.devteam.module.account.config;

import com.devteam.core.module.data.CoreDataModuleConfig;
import com.devteam.core.module.data.db.repository.BaseRepositoryFactoryBean;
import com.devteam.core.module.http.config.CoreHttpModuleConfig;
import com.devteam.core.module.security.config.CoreSecurityModuleConfig;
import com.devteam.core.module.srpingframework.config.ModuleConfig;
import com.devteam.module.storage.config.StorageModuleConfig;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.EnableTransactionManagement;



@Configuration
@ModuleConfig(
    basePackages= {"com.devteam.module.account"}
)
@ComponentScan(
   basePackages = { "com.devteam.module.account" }
)
@EnableJpaRepositories(
  basePackages = { "com.devteam.module.account.repository" },
  repositoryFactoryBeanClass = BaseRepositoryFactoryBean.class
)
@EnableConfigurationProperties
@EnableTransactionManagement
@Import(value = {
  CoreHttpModuleConfig.class, CoreDataModuleConfig.class,
  StorageModuleConfig.class, CoreSecurityModuleConfig.class
})
public class AccountModuleConfig {
  @Bean
  public PasswordEncoder encoder() { return new BCryptPasswordEncoder(); }
}