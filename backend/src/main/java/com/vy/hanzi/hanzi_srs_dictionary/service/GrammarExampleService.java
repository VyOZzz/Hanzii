package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.GrammarExampleResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.GrammarExample;
import com.vy.hanzi.hanzi_srs_dictionary.repository.GrammarExampleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GrammarExampleService {
    private final GrammarExampleRepository grammarExampleRepository;

    public List<GrammarExampleResponseDTO> getByGrammarPointId(Long grammarPointId) {
        return grammarExampleRepository.findByGrammarPointId(grammarPointId).stream()
                .map(this::toDto)
                .toList();
    }

    private GrammarExampleResponseDTO toDto(GrammarExample grammarExample) {
        return GrammarExampleResponseDTO.builder()
                .id(grammarExample.getId())
                .content(grammarExample.getContent())
                .meaning(grammarExample.getMeaning())
                .pinyin(grammarExample.getPinyin())
                .grammarPointId(grammarExample.getGrammarPoint() == null ? null : grammarExample.getGrammarPoint().getId())
                .build();
    }
}
