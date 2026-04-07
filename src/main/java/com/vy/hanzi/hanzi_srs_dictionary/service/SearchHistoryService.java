package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.SearchHistoryResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.SearchHistory;
import com.vy.hanzi.hanzi_srs_dictionary.repository.SearchHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchHistoryService {
    private final SearchHistoryRepository searchHistoryRepository;

    public List<SearchHistoryResponseDTO> getRecentByUser(Long userId) {
        return searchHistoryRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    private SearchHistoryResponseDTO toDto(SearchHistory searchHistory) {
        return SearchHistoryResponseDTO.builder()
                .id(searchHistory.getId())
                .queryText(searchHistory.getQueryText())
                .createdAt(searchHistory.getCreatedAt())
                .userId(searchHistory.getUser() == null ? null : searchHistory.getUser().getId())
                .wordId(searchHistory.getWord() == null ? null : searchHistory.getWord().getId())
                .build();
    }
}
