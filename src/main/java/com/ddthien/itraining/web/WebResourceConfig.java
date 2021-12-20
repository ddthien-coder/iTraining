package com.ddthien.itraining.web;

import static springfox.documentation.builders.PathSelectors.regex;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
@EnableWebSecurity
public class WebResourceConfig extends WebMvcConfigurationSupport {

    @Bean
    public Docket productApi() {
        return new Docket(DocumentationType.SWAGGER_2).
                ignoredParameterTypes(HttpServletRequest.class, HttpSession.class).
                select().
                apis(RequestHandlerSelectors.basePackage("com.ddthien.itraining.module.http.rest")).
                paths(regex("/rest/v1.0.0/.*")).
                build().
                apiInfo(metaData());
    }

    private ApiInfo metaData() {
        return new ApiInfoBuilder().
                title("iTraining REST API").
                description("iTraining REST API").
                version("1.0.0").
                license("iTraining License").
                licenseUrl("https://iTraining.com").
                contact(new Contact("ddthien", "https://iTraining.com", "jungjihoonkr97@gmail.com")).
                build();
    }

    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
        registry.addResourceHandler("/**").addResourceLocations("classpath:/public/");
    }
}
