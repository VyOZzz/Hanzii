package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.dto.SearchHistoryResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.service.SearchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search-history")
@RequiredArgsConstructor
public class SearchHistoryController {
    private final SearchHistoryService searchHistoryService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<SearchHistoryResponseDTO>>> getRecentByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Get search history successfully",
                searchHistoryService.getRecentByUser(userId)
        ));
    }
}
