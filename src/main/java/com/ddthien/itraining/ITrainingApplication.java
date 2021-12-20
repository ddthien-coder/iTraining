package com.ddthien.itraining;

import com.ddthien.itraining.core.DatasourceConfiguration;
import com.ddthien.itraining.core.PropertySourceConfig;
import com.ddthien.itraining.core.http.HttpConfig;
import com.ddthien.itraining.lib.util.text.StringUtil;
import com.ddthien.itraining.module.account.ModuleAccountConfig;
import com.ddthien.itraining.module.employee.ModuleEmployeeConfig;
import com.ddthien.itraining.module.security.ModuleSecurityConfig;
import com.ddthien.itraining.web.WebMVCConfig;
import com.ddthien.itraining.web.WebResourceConfig;
import com.ddthien.itraining.web.WebSecurityConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(
        basePackages = {
                "com.ddthien.itraining",
                "com.ddthien.itraining.lib",
                "com.ddthien.itraining.web"
        }
)
@EnableConfigurationProperties
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class })
public class ITrainingApplication {

    private static final Logger logger = LoggerFactory.getLogger(ITrainingApplication.class);
    static ConfigurableApplicationContext context;

    static public ApplicationContext run(String[] args, long wait) throws Exception {
        if(args == null || args.length == 0) {
            args  = new String[] {
                    "--spring.cloud.zookeeper.enabled=false",
                    "--spring.http.multipart.enabled=true",
                    "--web.basic.enable=false",
                    "--web.ignored=/**",
                    "--server.port=7080",
                    "--app.home=build/server"
            };
        }

        logger.info("Launch ITrainingApp with args: {}", StringUtil.joinStringArray(args, " "));
        Class<?>[] sources = {
                WebSecurityConfig.class, WebResourceConfig.class, ITrainingApplication.class, WebMVCConfig.class,
                PropertySourceConfig.class, ModuleAccountConfig.class, ModuleEmployeeConfig.class,
                DatasourceConfiguration.class, HttpConfig.class, ModuleSecurityConfig.class
        };
        context = SpringApplication.run(sources, args);
        isRunning(wait);
        return context;
    }

    static public boolean isRunning(long wait) {
        boolean running = false;
        if(wait <= 0) wait = 1;
        try {
            while(!running && wait > 0) {
                if(context == null) running = false;
                else running = context.isRunning();
                wait -= 100;
                if(!running && wait > 0) Thread.sleep(100);
            }
        } catch(Exception ex) {
            ex.printStackTrace();
        }
        return running;
    }

    static public void exit() {
        if(context != null) {
            SpringApplication.exit(context);
            context = null;
        }
    }

    public static void main(String[] args) throws Exception {
        run(args, 30000);
        Thread.currentThread().join();
    }

}
