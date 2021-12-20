package com.devteam.module.company.core.config;

import com.devteam.config.JpaConfiguration;
import com.devteam.core.module.data.db.repository.BaseRepositoryFactoryBean;
import com.devteam.core.module.http.config.CoreHttpModuleConfig;
import com.devteam.core.module.security.config.CoreSecurityModuleConfig;
import com.devteam.core.module.srpingframework.config.ModuleConfig;
import com.devteam.module.storage.config.StorageModuleConfig;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@Configuration
@ModuleConfig(
    basePackages= {"com.devteam.module.company"}
)
@ComponentScan(
  basePackages = {"com.devteam.module.company"}
)
@EnableJpaRepositories(
  basePackages = {
    "com.devteam.module.company.core.repository"
  },
  repositoryFactoryBeanClass = BaseRepositoryFactoryBean.class
)
@EnableConfigurationProperties
@EnableTransactionManagement
@Import(
  value = {
    JpaConfiguration.class, CoreHttpModuleConfig.class,
    StorageModuleConfig.class, CoreSecurityModuleConfig.class
  }
)
public class CompanyModuleConfig {
}