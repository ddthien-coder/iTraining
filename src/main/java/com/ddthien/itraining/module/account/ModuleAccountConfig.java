package com.ddthien.itraining.module.account;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@ComponentScan(
        basePackages = {
                "com.ddthien.itraining.module.account",
        }
)
@EnableJpaRepositories(
        basePackages = {
                "com.ddthien.itraining.account.repository",
        }
)

@EnableConfigurationProperties
@EnableTransactionManagement
@EnableAspectJAutoProxy(proxyTargetClass=true)
public class ModuleAccountConfig {
}
