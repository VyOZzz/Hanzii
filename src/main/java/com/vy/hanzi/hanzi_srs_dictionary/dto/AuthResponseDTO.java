package com.vy.hanzi.hanzi_srs_dictionary.dto;

import com.vy.hanzi.hanzi_srs_dictionary.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private Long userId;
    private String username;
    private String email;
    private Role role;
}
