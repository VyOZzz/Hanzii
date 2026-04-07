package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.dto.WordExampleResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.WordGraphicResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.service.WordExampleService;
import com.vy.hanzi.hanzi_srs_dictionary.service.WordGraphicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/word-assets")
@RequiredArgsConstructor
public class WordAssetController {
    private final WordExampleService wordExampleService;
    private final WordGraphicService wordGraphicService;

    @GetMapping("/examples/{wordId}")
    public ResponseEntity<ApiResponse<List<WordExampleResponseDTO>>> getExamplesByWordId(@PathVariable Long wordId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Get word examples successfully",
                wordExampleService.getByWordId(wordId)
        ));
    }

    @GetMapping("/graphics/{wordId}")
    public ResponseEntity<ApiResponse<List<WordGraphicResponseDTO>>> getGraphicsByWordId(@PathVariable Long wordId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Get word graphics successfully",
                wordGraphicService.getByWordId(wordId)
        ));
    }
}
