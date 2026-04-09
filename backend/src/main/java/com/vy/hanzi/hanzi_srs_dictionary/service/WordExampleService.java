package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.WordExampleResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.WordExample;
import com.vy.hanzi.hanzi_srs_dictionary.repository.WordExampleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WordExampleService {
    private final WordExampleRepository wordExampleRepository;

    public List<WordExampleResponseDTO> getByWordId(Long wordId) {
        return wordExampleRepository.findByWordId(wordId).stream().map(this::toDto).toList();
    }

    private WordExampleResponseDTO toDto(WordExample wordExample) {
        return WordExampleResponseDTO.builder()
                .id(wordExample.getId())
                .content(wordExample.getContent())
                .meaning(wordExample.getMeaning())
                .pinyin(wordExample.getPinyin())
                .wordId(wordExample.getWord() == null ? null : wordExample.getWord().getId())
                .build();
    }
}
