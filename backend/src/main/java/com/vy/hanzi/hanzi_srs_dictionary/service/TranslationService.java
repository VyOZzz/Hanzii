package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.TranslationResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Translation;
import com.vy.hanzi.hanzi_srs_dictionary.repository.TranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TranslationService {
    private final TranslationRepository translationRepository;

    public List<TranslationResponseDTO> getRecentByUser(Long userId) {
        return translationRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    private TranslationResponseDTO toDto(Translation translation) {
        return TranslationResponseDTO.builder()
                .id(translation.getId())
                .sourceText(translation.getSourceText())
                .translatedText(translation.getTranslatedText())
                .sourceLanguage(translation.getSourceLanguage())
                .targetLanguage(translation.getTargetLanguage())
                .createdAt(translation.getCreatedAt())
                .userId(translation.getUser() == null ? null : translation.getUser().getId())
                .build();
    }
}
