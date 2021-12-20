package com.devteam.core.module.data;

import com.devteam.config.JpaConfiguration;
import com.devteam.core.module.data.db.repository.BaseRepositoryFactoryBean;
import com.devteam.core.module.srpingframework.config.ModuleConfig;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@ModuleConfig(
    basePackages = { 
            "com.devteam.core.module.data.db",
            "com.devteam.core.module.data.db.plugin"
    }
)
@Configuration
@ComponentScan(basePackages = {
        "com.devteam.core.module.data.db",
        "com.devteam.core.module.data.db.plugin"
   }
)
@EnableConfigurationProperties
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = { "com.devteam.core.module.data.db.plugin.repository" },
  repositoryFactoryBeanClass = BaseRepositoryFactoryBean.class
)
@EnableAutoConfiguration
@Import({JpaConfiguration.class})
public class CoreDataModuleConfig {
}