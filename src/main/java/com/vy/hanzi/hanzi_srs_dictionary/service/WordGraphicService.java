package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.WordGraphicResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.WordGraphic;
import com.vy.hanzi.hanzi_srs_dictionary.repository.WordGraphicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WordGraphicService {
    private final WordGraphicRepository wordGraphicRepository;

    public List<WordGraphicResponseDTO> getByWordId(Long wordId) {
        return wordGraphicRepository.findByWordIdOrderByGifOrderAsc(wordId).stream().map(this::toDto).toList();
    }

    private WordGraphicResponseDTO toDto(WordGraphic wordGraphic) {
        return WordGraphicResponseDTO.builder()
                .id(wordGraphic.getId())
                .gifUrl(wordGraphic.getGifUrl())
                .gifOrder(wordGraphic.getGifOrder())
                .wordId(wordGraphic.getWord() == null ? null : wordGraphic.getWord().getId())
                .build();
    }
}
