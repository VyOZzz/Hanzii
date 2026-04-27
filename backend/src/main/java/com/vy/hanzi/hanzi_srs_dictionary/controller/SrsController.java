package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.dto.SrsAddWordRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.SrsReviewCardResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.SrsReviewSubmitRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.security.CurrentUserService;
import com.vy.hanzi.hanzi_srs_dictionary.service.SrsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/srs")
@RequiredArgsConstructor
public class SrsController {
    private final SrsService srsService;
    private final CurrentUserService currentUserService;

    @PostMapping("/cards")
    public ResponseEntity<ApiResponse<SrsReviewCardResponseDTO>> addWordToSrs(@RequestBody SrsAddWordRequestDTO request) {
        request.setUserId(currentUserService.requireUserId());
        return ResponseEntity.ok(ApiResponse.success("Add word to SRS successfully", srsService.addWordToSrs(request)));
    }

    @GetMapping("/cards/me")
    public ResponseEntity<ApiResponse<List<SrsReviewCardResponseDTO>>> getAllCards() {
        Long userId = currentUserService.requireUserId();
        return ResponseEntity.ok(ApiResponse.success("Get SRS cards successfully", srsService.getAllCards(userId)));
    }

    @GetMapping("/review/today")
    public ResponseEntity<ApiResponse<List<SrsReviewCardResponseDTO>>> getDueCards() {
        Long userId = currentUserService.requireUserId();
        return ResponseEntity.ok(ApiResponse.success("Get due review cards successfully", srsService.getDueCards(userId)));
    }

    @PostMapping("/review")
    public ResponseEntity<ApiResponse<SrsReviewCardResponseDTO>> submitReview(@RequestBody SrsReviewSubmitRequestDTO request) {
        request.setUserId(currentUserService.requireUserId());
        return ResponseEntity.ok(ApiResponse.success("Submit SRS review successfully", srsService.submitReview(request)));
    }

    /**
     * Ensure all words in a notebook have SRS cards, then return due cards for that notebook.
     */
    @PostMapping("/cards/notebook/{notebookId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> prepareNotebookReview(
            @PathVariable Long notebookId,
            @RequestParam(defaultValue = "false") boolean all
    ) {
        Long userId = currentUserService.requireUserId();
        int newCards = srsService.ensureNotebookWordsInSrs(userId, notebookId);
        List<SrsReviewCardResponseDTO> dueCards = all 
                ? srsService.getAllCardsByNotebook(userId, notebookId)
                : srsService.getDueCardsByNotebook(userId, notebookId);

        Map<String, Object> result = Map.of(
                "newCardsCreated", newCards,
                "dueCards", dueCards
        );
        return ResponseEntity.ok(ApiResponse.success("Notebook review prepared successfully", result));
    }

    /**
     * Get due SRS cards for a specific notebook.
     */
    @GetMapping("/review/notebook/{notebookId}")
    public ResponseEntity<ApiResponse<List<SrsReviewCardResponseDTO>>> getDueCardsByNotebook(@PathVariable Long notebookId) {
        Long userId = currentUserService.requireUserId();
        return ResponseEntity.ok(ApiResponse.success(
                "Get notebook due cards successfully",
                srsService.getDueCardsByNotebook(userId, notebookId)
        ));
    }
}
