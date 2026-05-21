package com.vy.hanzi.hanzi_srs_dictionary.dto;

import lombok.Data;

@Data
public class AIConfigUpdateRequestDTO {
    private String apiKey;
    private String model;
    private String systemPrompt;
    private Boolean isActive;
}
