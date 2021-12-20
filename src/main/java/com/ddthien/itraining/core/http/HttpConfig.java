package com.ddthien.itraining.core.http;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = {
        "com.ddthien.itraining.core.http",
        "com.ddthien.itraining.core.http.rest"
}
)
@EnableConfigurationProperties
public class HttpConfig {
}
