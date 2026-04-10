package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.dto.TranslateRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.TranslationResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.security.CurrentUserService;
import com.vy.hanzi.hanzi_srs_dictionary.service.TranslationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/translations")
@RequiredArgsConstructor
public class TranslationController {
    private final TranslationService translationService;
    private final CurrentUserService currentUserService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<TranslationResponseDTO>>> getRecentByUser() {
        Long userId = currentUserService.requireUserId();
        return ResponseEntity.ok(ApiResponse.success(
                "Get translations successfully",
                translationService.getRecentByUser(userId)
        ));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TranslationResponseDTO>> translateText(@RequestBody TranslateRequestDTO request) {
        Long userId = currentUserService.requireUserId();
        TranslationResponseDTO result = translationService.translateText(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Translation saved successfully", result));
    }
}
