package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.AIConfigResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.service.AIConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai-config")
@RequiredArgsConstructor
public class AIConfigController {
    private final AIConfigService aiConfigService;

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<AIConfigResponseDTO>> getLatestConfig() {
        return ResponseEntity.ok(ApiResponse.success("Get latest AI config successfully", aiConfigService.getLatestConfig()));
    }
}
