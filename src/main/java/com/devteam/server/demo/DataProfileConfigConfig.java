package com.devteam.server.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;

@Configuration
@Import(value = {
})
public class DataProfileConfigConfig {
  @Bean("TestService")
  public DataInitService createTestDataService() {
    return new DataInitService();
  }
}
