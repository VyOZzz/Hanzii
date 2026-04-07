package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.AuthResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.LoginRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.RegisterRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Role;
import com.vy.hanzi.hanzi_srs_dictionary.entity.User;
import com.vy.hanzi.hanzi_srs_dictionary.exception.BadRequestException;
import com.vy.hanzi.hanzi_srs_dictionary.exception.UnauthorizedException;
import com.vy.hanzi.hanzi_srs_dictionary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

        return toAuthResponse(user);
    }

    private AuthResponseDTO toAuthResponse(User user) {
        return AuthResponseDTO.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
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
