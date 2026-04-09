package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.dto.GrammarExampleResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.service.GrammarExampleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/grammar-examples")
@RequiredArgsConstructor
public class GrammarExampleController {
    private final GrammarExampleService grammarExampleService;

    @GetMapping("/grammar-point/{grammarPointId}")
    public ResponseEntity<ApiResponse<List<GrammarExampleResponseDTO>>> getByGrammarPointId(@PathVariable Long grammarPointId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Get grammar examples successfully",
                grammarExampleService.getByGrammarPointId(grammarPointId)
        ));
    }
}
