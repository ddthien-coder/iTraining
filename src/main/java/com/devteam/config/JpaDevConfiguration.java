package com.devteam.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.*;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import javax.sql.DataSource;
import java.util.HashMap;

@Configuration
@EnableConfigurationProperties
@EnableTransactionManagement
@EnableAutoConfiguration
@Import(value = {
        DatasourceConfiguration.class
})
public class JpaDevConfiguration {

    @Bean("validator")
    public LocalValidatorFactoryBean createLocalValidatorFactoryBean() {
        LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
        return bean;
    }

    @Bean("entityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactoryBean(
            @Value("${hibernate.hbm2ddl.auto:update}") String hbm2ddlAuto,
            @Value("${hibernate.dialect:org.hibernate.dialect.H2Dialect}") String hibernateDialect,
            @Value("${hibernate.show_sql:true}") String hibernateShowSql,
            @Value("${hibernate.format_sql:true}") String hibernateFormatSql,
            @Qualifier("datasource") DataSource ds,
            @Qualifier("validator") LocalValidatorFactoryBean validator) {
        LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
        factoryBean.setDataSource(ds);
        factoryBean.setPackagesToScan("com.devteam.*");

        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        factoryBean.setJpaVendorAdapter(vendorAdapter);

        HashMap<String, Object> jpaPropMap = new HashMap<>();
        jpaPropMap.put("validator", validator);
        jpaPropMap.put("hibernate.hbm2ddl.auto", hbm2ddlAuto);
        jpaPropMap.put("hibernate.dialect", hibernateDialect);
        jpaPropMap.put("hibernate.show_sql", hibernateShowSql);
        jpaPropMap.put("hibernate.format_sql", hibernateFormatSql);
        jpaPropMap.put("hibernate.enable_lazy_load_no_trans", true);
        factoryBean.setJpaPropertyMap(jpaPropMap);
        return factoryBean;
    }

    @Primary
    @Bean("transactionManager")
    public PlatformTransactionManager transactionManager(
            @Qualifier("entityManagerFactory") LocalContainerEntityManagerFactoryBean factory) {
        System.out.println("\n\nTRANSACTION MANAGER\n\n");
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(factory.getObject());
        return transactionManager;
    }
}
