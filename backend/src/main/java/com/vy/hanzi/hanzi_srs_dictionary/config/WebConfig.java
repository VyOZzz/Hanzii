package com.vy.hanzi.hanzi_srs_dictionary.config;

import org.springframework.context.annotation.Configuration;

// CORS is now handled centrally in SecurityConfig.corsConfigurationSource()
// to ensure preflight OPTIONS requests are allowed before Spring Security filters run.
@Configuration
public class WebConfig {
}
