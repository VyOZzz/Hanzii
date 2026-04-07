package com.vy.hanzi.hanzi_srs_dictionary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrammarExampleResponseDTO {
    private Long id;
    private String content;
    private String meaning;
    private String pinyin;
    private Long grammarPointId;
}
