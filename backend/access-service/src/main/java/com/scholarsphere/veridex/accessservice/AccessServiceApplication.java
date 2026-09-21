package com.scholarsphere.veridex.accessservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {"com.scholarsphere.veridex.common", "com.scholarsphere.veridex.accessservice"})
public class AccessServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AccessServiceApplication.class, args);
    }
}
