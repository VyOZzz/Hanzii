package com.vy.hanzi.hanzi_srs_dictionary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SrsReviewCardResponseDTO {
    private Long cardId;
    private Long userId;
    private Long wordId;
    private String hanzi;
    private String pinyin;
    private String meaning;
    private int repetition;
    private int intervalDays;
    private LocalDateTime nextReviewAt;
}
