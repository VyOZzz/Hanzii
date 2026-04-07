package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.GrammarPointResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.GrammarPoint;
import com.vy.hanzi.hanzi_srs_dictionary.exception.NotFoundException;
import com.vy.hanzi.hanzi_srs_dictionary.repository.GrammarPointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GrammarPointService {
    private final GrammarPointRepository grammarPointRepository;

    public List<GrammarPointResponseDTO> getAll() {
        return grammarPointRepository.findAll().stream().map(this::toDto).toList();
    }

    public GrammarPointResponseDTO getById(Long id) {
        GrammarPoint grammarPoint = grammarPointRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Grammar point not found with id: " + id));
        return toDto(grammarPoint);
    }

    private GrammarPointResponseDTO toDto(GrammarPoint grammarPoint) {
        return GrammarPointResponseDTO.builder()
                .id(grammarPoint.getId())
                .title(grammarPoint.getTitle())
                .structure(grammarPoint.getStructure())
                .explanation(grammarPoint.getExplanation())
                .hskLevel(grammarPoint.getHskLevel())
                .build();
    }
}
