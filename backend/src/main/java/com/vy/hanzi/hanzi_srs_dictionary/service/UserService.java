package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.UserResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Role;
import com.vy.hanzi.hanzi_srs_dictionary.entity.User;
import com.vy.hanzi.hanzi_srs_dictionary.exception.BadRequestException;
import com.vy.hanzi.hanzi_srs_dictionary.exception.NotFoundException;
import com.vy.hanzi.hanzi_srs_dictionary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDto).toList();
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));
        return toDto(user);
    }

    public void deleteUser(Long id, Long currentUserId) {
        User current = userRepository.findById(currentUserId)
                .orElseThrow(() -> new NotFoundException("Current user not found"));
        if (current.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only ADMIN can delete users");
        }
        if (current.getId().equals(id)) {
            throw new BadRequestException("Admin cannot delete own account");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public UserResponseDTO blockUser(Long id, Boolean blocked, Long currentUserId) {
        User current = userRepository.findById(currentUserId)
                .orElseThrow(() -> new NotFoundException("Current user not found"));
        if (current.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only ADMIN can block users");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));
        user.setBlocked(Boolean.TRUE.equals(blocked));
        return toDto(userRepository.save(user));
    }

    private UserResponseDTO toDto(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .blocked(Boolean.TRUE.equals(user.getBlocked()))
                .build();
    }
}
