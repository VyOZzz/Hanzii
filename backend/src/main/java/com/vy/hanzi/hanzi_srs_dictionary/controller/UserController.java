package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.dto.UserBlockRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.UserResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.security.CurrentUserService;
import com.vy.hanzi.hanzi_srs_dictionary.service.AIUsageLogService;
import com.vy.hanzi.hanzi_srs_dictionary.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final CurrentUserService currentUserService;
    private final AIUsageLogService aiUsageLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Get users successfully", userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Get user detail successfully", userService.getUserById(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id, currentUserService.requireUserId());
        return ResponseEntity.ok(ApiResponse.success("Delete user successfully", "OK"));
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<ApiResponse<UserResponseDTO>> blockUser(@PathVariable Long id, @RequestBody UserBlockRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Update user block status successfully",
                userService.blockUser(id, request.getBlocked(), currentUserService.requireUserId())
        ));
    }

    @GetMapping("/ai/stats")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getAiStats() {
        Long currentUserId = currentUserService.requireUserId();
        UserResponseDTO me = userService.getUserById(currentUserId);
        if (me.getRole() != com.vy.hanzi.hanzi_srs_dictionary.entity.Role.ADMIN) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Only ADMIN can view AI stats", null));
        }
        return ResponseEntity.ok(ApiResponse.success("Get AI stats successfully", aiUsageLogService.buildStats()));
    }
}
