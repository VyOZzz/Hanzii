package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.TranslateRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.TranslationResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Translation;
import com.vy.hanzi.hanzi_srs_dictionary.entity.User;
import com.vy.hanzi.hanzi_srs_dictionary.exception.BadRequestException;
import com.vy.hanzi.hanzi_srs_dictionary.exception.NotFoundException;
import com.vy.hanzi.hanzi_srs_dictionary.repository.TranslationRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TranslationService {
    private final TranslationRepository translationRepository;
    private final UserRepository userRepository;

    public List<TranslationResponseDTO> getRecentByUser(Long userId) {
        return translationRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    public TranslationResponseDTO translateText(Long userId, TranslateRequestDTO request) {
        if (request.getSourceText() == null || request.getSourceText().isBlank()) {
            throw new BadRequestException("Source text is required");
        }
        if (request.getSourceLanguage() == null || request.getSourceLanguage().isBlank()) {
            throw new BadRequestException("Source language is required");
        }
        if (request.getTargetLanguage() == null || request.getTargetLanguage().isBlank()) {
            throw new BadRequestException("Target language is required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        // Save translation record (manual translation for now)
        String translated = (request.getTranslatedText() != null && !request.getTranslatedText().isBlank())
                ? request.getTranslatedText().trim()
                : request.getSourceText().trim(); // fallback to source text if no translation provided

        Translation translation = Translation.builder()
                .sourceText(request.getSourceText().trim())
                .translatedText(translated)
                .sourceLanguage(request.getSourceLanguage().trim())
                .targetLanguage(request.getTargetLanguage().trim())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        Translation saved = translationRepository.save(translation);
        return toDto(saved);
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
