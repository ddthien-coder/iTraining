package com.devteam.module.company.service.config;

import com.devteam.core.module.data.db.repository.BaseRepositoryFactoryBean;
import com.devteam.core.module.srpingframework.config.ModuleConfig;
import com.devteam.module.account.config.AccountModuleConfig;
import com.devteam.module.company.core.config.CompanyModuleConfig;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@ModuleConfig(
  basePackages= {
    "com.devteam.module.company.service.hr",
  }
)
@Configuration
@ComponentScan(
  basePackages = {
    "com.devteam.module.company.service.hr"
  }
)
@EnableJpaRepositories(
  basePackages = {
    "com.devteam.module.company.service.hr.repository",
  },
  repositoryFactoryBeanClass = BaseRepositoryFactoryBean.class
)
@Import({AccountModuleConfig.class, CompanyModuleConfig.class})
@EnableConfigurationProperties
@EnableTransactionManagement
public class CompanyHRModuleConfig {
}