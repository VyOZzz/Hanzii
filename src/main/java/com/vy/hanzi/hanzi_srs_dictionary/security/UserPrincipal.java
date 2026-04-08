package com.vy.hanzi.hanzi_srs_dictionary.security;

import com.vy.hanzi.hanzi_srs_dictionary.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserPrincipal {
    private Long userId;
    private String username;
    private Role role;
}
