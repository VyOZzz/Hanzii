package com.vy.hanzi.hanzi_srs_dictionary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequestDTO {
    private String oldPassword;
    private String newPassword;
}
