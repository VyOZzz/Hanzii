package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.AIConfigResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.AIConfig;
import com.vy.hanzi.hanzi_srs_dictionary.repository.AIConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIConfigService {
    private final AIConfigRepository aiConfigRepository;

    public AIConfigResponseDTO getLatestConfig() {
        return aiConfigRepository.findTopByOrderByIdDesc()
                .map(this::toDto)
                .orElse(AIConfigResponseDTO.builder().build());
    }

    private AIConfigResponseDTO toDto(AIConfig aiConfig) {
        return AIConfigResponseDTO.builder()
                .id(aiConfig.getId())
                .model(aiConfig.getModel())
                .systemPrompt(aiConfig.getSystemPrompt())
                .isActive(aiConfig.getIs_active())
                .build();
    }
}
