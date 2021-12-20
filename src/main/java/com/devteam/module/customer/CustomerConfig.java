package com.devteam.module.customer;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@ComponentScan(
        basePackages = { "com.devteam.module.customer" }
)
@EnableJpaRepositories(
        basePackages = { "com.devteam.module.customer.repository" }
)
@EnableConfigurationProperties
@EnableTransactionManagement
public class CustomerConfig {
}
