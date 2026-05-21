package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.AIConfigResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.AIConfigUpdateRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.security.CurrentUserService;
import com.vy.hanzi.hanzi_srs_dictionary.service.AIConfigService;
import com.vy.hanzi.hanzi_srs_dictionary.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai-config")
@RequiredArgsConstructor
public class AIConfigController {
    private final AIConfigService aiConfigService;
    private final UserService userService;
    private final CurrentUserService currentUserService;

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<AIConfigResponseDTO>> getLatestConfig() {
        return ResponseEntity.ok(ApiResponse.success("Get latest AI config successfully", aiConfigService.getLatestConfig()));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<AIConfigResponseDTO>> updateConfig(@RequestBody AIConfigUpdateRequestDTO request) {
        var me = userService.getUserById(currentUserService.requireUserId());
        if (me.getRole() != com.vy.hanzi.hanzi_srs_dictionary.entity.Role.ADMIN) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Only ADMIN can update AI config", null));
        }
        return ResponseEntity.ok(ApiResponse.success("Update AI config successfully", aiConfigService.updateConfig(request)));
    }
}
