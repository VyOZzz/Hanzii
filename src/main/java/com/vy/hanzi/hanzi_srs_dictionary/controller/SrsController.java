package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.dto.SrsAddWordRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.SrsReviewCardResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.SrsReviewSubmitRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.service.SrsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/srs")
@RequiredArgsConstructor
public class SrsController {
    private final SrsService srsService;

    @PostMapping("/cards")
    public ResponseEntity<ApiResponse<SrsReviewCardResponseDTO>> addWordToSrs(@RequestBody SrsAddWordRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Add word to SRS successfully", srsService.addWordToSrs(request)));
    }

    @GetMapping("/cards/user/{userId}")
    public ResponseEntity<ApiResponse<List<SrsReviewCardResponseDTO>>> getAllCards(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Get SRS cards successfully", srsService.getAllCards(userId)));
    }

    @GetMapping("/review/today/{userId}")
    public ResponseEntity<ApiResponse<List<SrsReviewCardResponseDTO>>> getDueCards(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Get due review cards successfully", srsService.getDueCards(userId)));
    }

    @PostMapping("/review")
    public ResponseEntity<ApiResponse<SrsReviewCardResponseDTO>> submitReview(@RequestBody SrsReviewSubmitRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Submit SRS review successfully", srsService.submitReview(request)));
    }
}
