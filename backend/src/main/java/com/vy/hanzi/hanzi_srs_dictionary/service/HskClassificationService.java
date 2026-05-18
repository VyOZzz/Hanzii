package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.entity.Word;
import com.vy.hanzi.hanzi_srs_dictionary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HskClassificationService {

    private final WordRepository wordRepository;
    private final AIAssistantService aiAssistantService;

    @Transactional
    public Map<String, Object> classifyMissingHskLevels(int limit, int batchSize) {
        int safeLimit = Math.max(1, Math.min(limit, 5000));
        int safeBatch = Math.max(1, Math.min(batchSize, 200));

        int processed = 0;
        int updated = 0;
        int failed = 0;

        while (processed < safeLimit) {
            int currentBatchSize = Math.min(safeBatch, safeLimit - processed);
            Page<Word> page = wordRepository.findByHskLevelLessThanEqualOrderByIdAsc(0, PageRequest.of(0, currentBatchSize));
            List<Word> words = page.getContent();

            if (words.isEmpty()) {
                break;
            }

            for (Word word : words) {
                Integer predictedLevel = aiAssistantService.classifyHskLevel(
                        word.getHanzi(),
                        word.getPinyin(),
                        word.getMeaning()
                );

                processed++;
                if (predictedLevel == null || predictedLevel < 1 || predictedLevel > 9) {
                    failed++;
                    continue;
                }

                word.setHskLevel(predictedLevel);
                wordRepository.save(word);
                updated++;
            }

            log.info("HSK classify progress: processed={}, updated={}, failed={}", processed, updated, failed);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("processed", processed);
        result.put("updated", updated);
        result.put("failed", failed);
        result.put("limit", safeLimit);
        result.put("batchSize", safeBatch);
        return result;
    }
}
