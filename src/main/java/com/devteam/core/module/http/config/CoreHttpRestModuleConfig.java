package com.devteam.core.module.http.config;

import com.devteam.core.module.srpingframework.config.SpringFrameworkModuleConfig;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@ComponentScan(
    basePackages = {
        "com.devteam.core.module.http.rest"
    }
)
@Import(value = {
    SpringFrameworkModuleConfig.class
})
@EnableConfigurationProperties
public class CoreHttpRestModuleConfig {
}