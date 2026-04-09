package com.vy.hanzi.hanzi_srs_dictionary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrammarPointResponseDTO {
    private Long id;
    private String title;
    private String structure;
    private String explanation;
    private Integer hskLevel;
}
