package com.ddthien.itraining.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMVCConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Set the routes that are allowed across the domain
        registry
                .addMapping("/**")
                .allowedOriginPatterns("*") // Set the domain name that allows cross-domain requests
                .allowCredentials(true) // whether to allow certificates (cookies)
                .allowedMethods("*") // Set the allowed methods
                .maxAge(3600); // Allowed time across domains
    }

}
