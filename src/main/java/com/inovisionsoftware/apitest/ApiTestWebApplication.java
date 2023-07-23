package com.inovisionsoftware.apitest;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication //(scanBasePackages = "com.inovisionsoftware")
@Slf4j
public class ApiTestWebApplication {

    public static void main(String[] args) {
        log.info("Starting applicationn API Web Test");
        SpringApplication.run(ApiTestWebApplication.class, args);
    }
}
