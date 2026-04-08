package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.dto.CreateNotebookRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.NotebookResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.security.CurrentUserService;
import com.vy.hanzi.hanzi_srs_dictionary.service.NotebookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notebooks")
@RequiredArgsConstructor
public class NotebookController {
    private final NotebookService notebookService;
    private final CurrentUserService currentUserService;

    @PostMapping
    public ResponseEntity<ApiResponse<NotebookResponseDTO>> createNotebook(@RequestBody CreateNotebookRequestDTO request) {
        request.setUserId(currentUserService.requireUserId());
        NotebookResponseDTO notebook = notebookService.createNotebook(request);
        return ResponseEntity.ok(ApiResponse.success("Create notebook successfully", notebook));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<NotebookResponseDTO>>> getMyNotebooks() {
        Long userId = currentUserService.requireUserId();
        return ResponseEntity.ok(ApiResponse.success("Get notebooks successfully", notebookService.getNotebooksByUser(userId)));
    }

    @PostMapping("/{notebookId}/words/{wordId}")
    public ResponseEntity<ApiResponse<NotebookResponseDTO>> addWordToNotebook(
            @PathVariable Long notebookId,
            @PathVariable Long wordId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Add word to notebook successfully",
                notebookService.addWordToNotebook(notebookId, wordId)
        ));
    }
}
