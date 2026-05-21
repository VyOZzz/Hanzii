package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.AIConfigResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.AIConfigUpdateRequestDTO;
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

    public AIConfigResponseDTO updateConfig(AIConfigUpdateRequestDTO request) {
        AIConfig current = aiConfigRepository.findTopByOrderByIdDesc().orElse(AIConfig.builder().build());
        if (request.getApiKey() != null && !request.getApiKey().isBlank()) {
            current.setApiKey(request.getApiKey().trim());
        }
        if (request.getModel() != null) {
            current.setModel(request.getModel().trim());
        }
        if (request.getSystemPrompt() != null) {
            current.setSystemPrompt(request.getSystemPrompt().trim());
        }
        if (request.getIsActive() != null) {
            current.setIs_active(request.getIsActive());
        }
        return toDto(aiConfigRepository.save(current));
    }

    private AIConfigResponseDTO toDto(AIConfig aiConfig) {
        return AIConfigResponseDTO.builder()
                .id(aiConfig.getId())
                .apiKeyMasked(maskKey(aiConfig.getApiKey()))
                .model(aiConfig.getModel())
                .systemPrompt(aiConfig.getSystemPrompt())
                .isActive(aiConfig.getIs_active())
                .build();
    }

    private String maskKey(String key) {
        if (key == null || key.length() < 8) return "";
        return key.substring(0, 4) + "..." + key.substring(key.length() - 4);
    }
}
