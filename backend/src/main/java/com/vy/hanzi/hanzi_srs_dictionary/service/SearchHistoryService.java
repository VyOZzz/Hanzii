package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.SearchHistoryResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.SearchHistory;
import com.vy.hanzi.hanzi_srs_dictionary.entity.User;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Word;
import com.vy.hanzi.hanzi_srs_dictionary.repository.SearchHistoryRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.UserRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchHistoryService {
    private final SearchHistoryRepository searchHistoryRepository;
    private final UserRepository userRepository;
    private final WordRepository wordRepository;

    public List<SearchHistoryResponseDTO> getRecentByUser(Long userId) {
        return searchHistoryRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    public void recordSearchQuery(Long userId, String queryText) {
        if (userId == null || queryText == null || queryText.isBlank()) {
            return;
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return;
        }

        SearchHistory history = SearchHistory.builder()
                .queryText(queryText.trim())
                .createdAt(LocalDateTime.now())
                .user(user)
                .word(getFallbackWord())
                .build();

        if (history.getWord() == null) {
            return;
        }

        searchHistoryRepository.save(history);
    }

    public void recordWordDetailClick(Long userId, Long wordId) {
        if (userId == null || wordId == null) {
            return;
        }

        User user = userRepository.findById(userId).orElse(null);
        Word word = wordRepository.findById(wordId).orElse(null);
        if (user == null || word == null) {
            return;
        }

        SearchHistory history = SearchHistory.builder()
                .queryText(word.getHanzi() == null || word.getHanzi().isBlank() ? word.getMeaning() : word.getHanzi())
                .createdAt(LocalDateTime.now())
                .word(word)
                .user(user)
                .build();

        searchHistoryRepository.save(history);
    }

    private Word getFallbackWord() {
        return wordRepository.findTop100ByOrderByHskLevelAscIdAsc().stream().findFirst().orElse(null);
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
