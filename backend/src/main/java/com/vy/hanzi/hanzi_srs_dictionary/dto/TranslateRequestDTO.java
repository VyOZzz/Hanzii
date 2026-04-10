package com.vy.hanzi.hanzi_srs_dictionary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TranslateRequestDTO {
    private String sourceText;
    private String translatedText;
    private String sourceLanguage;
    private String targetLanguage;
}
