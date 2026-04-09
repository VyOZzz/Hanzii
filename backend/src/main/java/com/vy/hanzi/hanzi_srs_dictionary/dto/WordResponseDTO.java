package com.vy.hanzi.hanzi_srs_dictionary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordResponseDTO {
    private Long id;
    private String hanzi;
    private String pinyin;
    private String meaning;
    private String sinoVietnamese;
    private int hskLevel;
    private int strokeCount;
    private String audioUrl;

    private List<String> wordTypes;
}
