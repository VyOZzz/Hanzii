package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.dto.GrammarPointResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.service.GrammarPointService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/grammar-points")
@RequiredArgsConstructor
public class GrammarController {
    private final GrammarPointService grammarPointService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GrammarPointResponseDTO>>> getAllGrammarPoints() {
        return ResponseEntity.ok(ApiResponse.success("Get grammar points successfully", grammarPointService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GrammarPointResponseDTO>> getGrammarPointById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Get grammar point detail successfully", grammarPointService.getById(id)));
    }
}
