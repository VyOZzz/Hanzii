package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.dto.WordResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.security.CurrentUserService;
import com.vy.hanzi.hanzi_srs_dictionary.service.SearchHistoryService;
import com.vy.hanzi.hanzi_srs_dictionary.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;
    private final CurrentUserService currentUserService;
    private final SearchHistoryService searchHistoryService;
    // API tìm kiếm: localhost:8080/api/words/search?keyword=hao&page=0&size=10
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<WordResponseDTO>>> search(@RequestParam String keyword, Pageable pageable) {
        Page<WordResponseDTO> result = wordService.searchWords(keyword, pageable);
        Long userId = currentUserService.getCurrentUserIdOrNull();
        if (userId != null) {
            searchHistoryService.recordSearchQuery(userId, keyword);
        }

        Map<String, Object> meta = Map.of(
                "page", result.getNumber(),
                "size", result.getSize(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
        );

        return ResponseEntity.ok(ApiResponse.success("Search words successfully", result, meta));
    }

    // API lấy chi tiết 1 từ: localhost:8080/api/words/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WordResponseDTO>> getDetail(@PathVariable Long id) {
        WordResponseDTO word = wordService.getDetail(id);
        Long userId = currentUserService.getCurrentUserIdOrNull();
        if (userId != null) {
            searchHistoryService.recordWordDetailClick(userId, id);
        }
        return ResponseEntity.ok(ApiResponse.success("Get word detail successfully", word));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<java.util.List<WordResponseDTO>>> filterByHskAndTypes(
            @RequestParam Integer hskLevel,
            @RequestParam java.util.List<String> types
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Filter words successfully",
                wordService.getWordsByHskAndTypes(hskLevel, types)
        ));
    }

    @GetMapping("/filter/paged")
    public ResponseEntity<ApiResponse<Page<WordResponseDTO>>> filterByHskAndTypesPaged(
            @RequestParam Integer hskLevel,
            @RequestParam java.util.List<String> types,
            Pageable pageable
    ) {
        Page<WordResponseDTO> result = wordService.getWordsByHskAndTypesPaged(hskLevel, types, pageable);
        Map<String, Object> meta = Map.of(
                "page", result.getNumber(),
                "size", result.getSize(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
        );

        return ResponseEntity.ok(ApiResponse.success("Filter words successfully", result, meta));
    }

    @GetMapping("/recommended/me")
    public ResponseEntity<ApiResponse<java.util.List<WordResponseDTO>>> getRecommendedWords() {
        Long userId = currentUserService.requireUserId();
        return ResponseEntity.ok(ApiResponse.success(
                "Get recommended words successfully",
                wordService.getRecommendedWordsByUser(userId)
        ));
    }

    @GetMapping("/recommended/me/paged")
    public ResponseEntity<ApiResponse<Page<WordResponseDTO>>> getRecommendedWordsPaged(Pageable pageable) {
        Long userId = currentUserService.requireUserId();
        Page<WordResponseDTO> result = wordService.getRecommendedWordsByUser(userId, pageable);
        Map<String, Object> meta = Map.of(
                "page", result.getNumber(),
                "size", result.getSize(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
        );

        return ResponseEntity.ok(ApiResponse.success(
                "Get recommended words successfully",
                result,
                meta
        ));
    }
}
