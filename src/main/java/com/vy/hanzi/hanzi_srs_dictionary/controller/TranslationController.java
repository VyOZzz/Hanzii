package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.dto.TranslationResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.service.TranslationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/translations")
@RequiredArgsConstructor
public class TranslationController {
    private final TranslationService translationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TranslationResponseDTO>>> getRecentByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Get translations successfully",
                translationService.getRecentByUser(userId)
        ));
    }
}
