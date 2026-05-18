package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.service.AIAssistantService;
import com.vy.hanzi.hanzi_srs_dictionary.service.HskClassificationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIAssistantService aiAssistantService;
    private final HskClassificationService hskClassificationService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<String>> chat(@RequestBody ChatRequest request) {
        if (request == null || request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Message cannot be empty", null));
        }

        String aiResponse = aiAssistantService.chatWithTutor(request.getMessage());
        return ResponseEntity.ok(ApiResponse.success("AI response received", aiResponse));
    }

    @PostMapping("/classify-missing-hsk")
    public ResponseEntity<ApiResponse<Map<String, Object>>> classifyMissingHsk(@RequestBody(required = false) ClassifyHskRequest request) {
        int limit = request != null && request.getLimit() != null ? request.getLimit() : 200;
        int batchSize = request != null && request.getBatchSize() != null ? request.getBatchSize() : 20;

        Map<String, Object> result = hskClassificationService.classifyMissingHskLevels(limit, batchSize);
        return ResponseEntity.ok(ApiResponse.success("HSK classification completed", result));
    }

    @Data
    public static class ChatRequest {
        private String message;
    }

    @Data
    public static class ClassifyHskRequest {
        private Integer limit;
        private Integer batchSize;
    }
}
