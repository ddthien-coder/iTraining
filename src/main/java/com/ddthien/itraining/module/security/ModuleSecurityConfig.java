package com.ddthien.itraining.module.security;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@ComponentScan(basePackages = { "com.ddthien.itraining.module.security" })
@EnableJpaRepositories(
        basePackages = {"com.ddthien.itraining.module.security.repository"}
)
@EnableConfigurationProperties
@EnableTransactionManagement
public class ModuleSecurityConfig {
}
