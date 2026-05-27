package com.diploma.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Говорим: "Если просят /uploads/..., ищи файлы в папке uploads проекта"
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}