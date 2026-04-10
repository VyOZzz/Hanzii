package com.vy.hanzi.hanzi_srs_dictionary.controller;

import com.vy.hanzi.hanzi_srs_dictionary.dto.ApiResponse;
import com.vy.hanzi.hanzi_srs_dictionary.dto.AuthResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.ChangePasswordRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.LoginRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.RegisterRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.security.CurrentUserService;
import com.vy.hanzi.hanzi_srs_dictionary.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final CurrentUserService currentUserService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> register(@RequestBody RegisterRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Register successfully", authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Login successfully", authService.login(request)));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody ChangePasswordRequestDTO request) {
        Long userId = currentUserService.requireUserId();
        authService.changePassword(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
}
