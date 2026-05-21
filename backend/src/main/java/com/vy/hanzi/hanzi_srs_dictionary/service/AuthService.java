package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.AuthResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.ChangePasswordRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.LoginRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.RegisterRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Role;
import com.vy.hanzi.hanzi_srs_dictionary.entity.User;
import com.vy.hanzi.hanzi_srs_dictionary.exception.BadRequestException;
import com.vy.hanzi.hanzi_srs_dictionary.exception.UnauthorizedException;
import com.vy.hanzi.hanzi_srs_dictionary.repository.UserRepository;
import com.vy.hanzi.hanzi_srs_dictionary.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponseDTO register(RegisterRequestDTO request) {
        String username = normalize(request.getUsername());
        String email = normalize(request.getEmail());
        String password = request.getPassword();

        if (username == null || email == null || password == null || password.isBlank()) {
            throw new BadRequestException("Username, email, and password are required");
        }

        if (userRepository.findByUsername(username).isPresent()) {
            throw new BadRequestException("Username already exists");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);
        return toAuthResponse(savedUser);
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        String username = normalize(request.getUsername());
        String password = request.getPassword();

        if (username == null || password == null || password.isBlank()) {
            throw new BadRequestException("Username and password are required");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }
        if (Boolean.TRUE.equals(user.getBlocked())) {
            throw new UnauthorizedException("Your account is blocked");
        }

        return toAuthResponse(user);
    }

    public void changePassword(Long userId, ChangePasswordRequestDTO request) {
        if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
            throw new BadRequestException("Old password is required");
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private AuthResponseDTO toAuthResponse(User user) {
        String token = jwtService.generateToken(user.getId(), user.getUsername(), user.getRole());

        return AuthResponseDTO.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .accessToken(token)
                .tokenType("Bearer")
                .build();
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
