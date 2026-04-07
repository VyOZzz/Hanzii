package com.vy.hanzi.hanzi_srs_dictionary.config;

import com.vy.hanzi.hanzi_srs_dictionary.repository.WordRepository;
import com.vy.hanzi.hanzi_srs_dictionary.service.WordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    private final WordService wordService;
    private final WordRepository wordRepository;
    @Value("${dictionary.import.enabled:true}")
    private boolean importEnabled;
    @Value("${dictionary.import.file-path:}")
    private String filePath;
    @Bean
    CommandLineRunner initData() {
        return args -> {
            if(!importEnabled) {
                log.info("Data import is disabled. Skipping.");
                return;
            }
            if(wordRepository.count() > 0) {
                log.info("Data already exists. Skipping import.");
                return;
            }
            if(filePath == null || filePath.isBlank()) {
                log.warn("Import file path is not set. Skipping import.");
                return;
            }
            Path path = Path.of(filePath);
            if(!Files.exists(path)) {
                log.error("Import file not found at path: {}. Skipping import.", filePath);
                return;
            }
            log.info("starting data import from file: {}", filePath);
            wordService.importFromU8(filePath);
            log.info("dictionary data import completed successfully.");
        };

    }
}
