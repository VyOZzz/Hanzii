package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.WordResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.exception.BadRequestException;
import com.vy.hanzi.hanzi_srs_dictionary.exception.NotFoundException;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Word;
import com.vy.hanzi.hanzi_srs_dictionary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class WordService {

    private final WordRepository wordRepository;
    public Page<WordResponseDTO> searchWords(String keyword, Pageable pageable) {
        String strippedPinyin = keyword != null ? keyword.replaceAll("\\s+", "") : "";
        Page<Word> words = wordRepository.searchWordsFlexible(
                keyword,
                strippedPinyin,
                pageable
        );
        return words.map(this::convertToDTO);
    }

    public Page<WordResponseDTO> suggestWords(String keyword, Pageable pageable) {
        String strippedPinyin = keyword != null ? keyword.replaceAll("\\s+", "") : "";
        Page<Word> words = wordRepository.suggestWords(
                keyword,
                strippedPinyin,
                pageable
        );
        return words.map(this::convertToDTO);
    }

    private WordResponseDTO convertToDTO(Word word) {
        return WordResponseDTO.builder()
                .id(word.getId())
                .hanzi(word.getHanzi())
                .pinyin(word.getPinyin())
                .meaning(word.getMeaning())
                .sinoVietnamese(word.getSinoVietnamese())
                .hskLevel(word.getHskLevel())
                .strokeCount(word.getStrokeCount())
                .audioUrl(word.getAudioUrl())
                .wordTypes(word.getTypes() == null ? List.of() : word.getTypes().stream()
                        .filter(Objects::nonNull)
                        .map(type -> type.getName())
                        .toList())
                .build();
    }

    public List<WordResponseDTO> getTop100Words() {
        List<Word> words = wordRepository.findTop100ByOrderByHskLevelAscIdAsc();
        return words.stream().map(this::convertToDTO).toList();
    }
    public WordResponseDTO getDetail(Long id) {
        Word word = wordRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Từ vựng không tồn tại với ID: " + id));
        return convertToDTO(word);
    }

    public List<WordResponseDTO> getWordsByHskAndTypes(Integer hskLevel, List<String> types) {
        if (hskLevel == null) {
            throw new BadRequestException("hskLevel is required");
        }

        List<String> normalizedTypes = types == null ? List.of() : types.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(type -> !type.isEmpty())
                .toList();

        if (normalizedTypes.isEmpty()) {
            return wordRepository.findByHskLevel(hskLevel)
                    .stream()
                    .map(this::convertToDTO)
                    .toList();
        }

        return wordRepository.findByHskLevelAndTypes_NameIn(hskLevel, normalizedTypes)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public Page<WordResponseDTO> getWordsByHskAndTypesPaged(Integer hskLevel, List<String> types, Pageable pageable) {
        if (hskLevel == null) {
            throw new BadRequestException("hskLevel is required");
        }

        List<String> normalizedTypes = types == null ? List.of() : types.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(type -> !type.isEmpty())
                .toList();

        if (normalizedTypes.isEmpty()) {
            return wordRepository.findByHskLevel(hskLevel, pageable)
                    .map(this::convertToDTO);
        }

        return wordRepository.findByHskLevelAndTypes_NameIn(hskLevel, normalizedTypes, pageable)
                .map(this::convertToDTO);
    }

    public List<WordResponseDTO> getRecommendedWordsByUser(Long userId) {
        if (userId == null) {
            throw new BadRequestException("userId is required");
        }

        List<Word> words = wordRepository.findTop50BySearchHistories_User_IdOrderBySearchHistories_CreatedAtDesc(userId);
        if (words.isEmpty()) {
            words = wordRepository.findTop100ByOrderByHskLevelAscIdAsc();
        }

        return words.stream().map(this::convertToDTO).toList();
    }

    public Page<WordResponseDTO> getRecommendedWordsByUser(Long userId, Pageable pageable) {
        if (userId == null) {
            throw new BadRequestException("userId is required");
        }

        Page<Word> words = wordRepository.findTop50BySearchHistories_User_IdOrderBySearchHistories_CreatedAtDesc(userId, pageable);
        if (words.isEmpty()) {
            words = wordRepository.findAll(pageable);
        }

        return words.map(this::convertToDTO);
    }

    public void importFromU8(InputStream inputStream) {
        try(BufferedReader reader = new BufferedReader(new java.io.InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String line;
            List<Word> batch = new java.util.ArrayList<>();
            while ((line = reader.readLine()) != null) {
                if(line.trim().isEmpty() || line.startsWith("#")) continue; // Bỏ qua dòng trống và comment
                String[] parts = line.split("\\s+", 3); //định dạng: hanzi pinyin meaning
                if(parts.length < 3) continue; // Bỏ qua dòng không đủ thông tin
                String traditional = parts[0];
                String simplified = parts[1];
                String rest = parts[2];
                String [] parts2 = rest.split("\\] /", 2);
                if(parts2.length < 2) continue; // Bỏ qua dòng không đủ thông tin
                String pinyin = parts2[0].replace("[", "").trim();
                String meaning = java.util.Arrays.stream(parts2[1].split("/"))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(java.util.stream.Collectors.joining(", "));
                
                meaning = meaning.replaceAll("[\\u4E00-\\u9FA5]+", "")
                                 .replaceAll("\\s*\\[[a-zA-Z0-9\\s]*\\]", "")
                                 .trim();
                Word word = Word.builder()
                        .hanzi(simplified)
                        .pinyin(pinyin)
                        .meaning(meaning)
                        .build();
                batch.add(word);
                if(batch.size() >= 1000 ){
                    wordRepository.saveAll(batch);
                    batch.clear();
                }
            }
            wordRepository.saveAll(batch); // Lưu batch cuối cùng nếu còn
        } catch (Exception e){
                log.error("Import from U8 failed", e);
        }
    }
    public void importFromU8(String filePath) {
        try(InputStream inputStream = new java.io.FileInputStream(filePath)) {
            importFromU8(inputStream);
        } catch (IOException e){
            log.error("Lỗi khi đọc file: " + filePath, e);
        }
    }

    @org.springframework.beans.factory.annotation.Value("${dictionary.import.file-path:}")
    private String dictionaryFilePath;

    @org.springframework.transaction.annotation.Transactional
    public void fixDictionaryMeanings() {
        if (dictionaryFilePath == null || dictionaryFilePath.isBlank()) {
            log.error("No dictionary file path found to fix meetings.");
            return;
        }
        log.info("Starting to fix dictionary meanings from file: {}", dictionaryFilePath);
        try(BufferedReader reader = new BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(dictionaryFilePath), StandardCharsets.UTF_8))) {
            String line;
            java.util.Map<String, String> dictMap = new java.util.HashMap<>();
            while ((line = reader.readLine()) != null) {
                if(line.trim().isEmpty() || line.startsWith("#")) continue;
                String[] parts = line.split("\\s+", 3);
                if(parts.length < 3) continue;
                String simplified = parts[1];
                String rest = parts[2];
                String [] parts2 = rest.split("\\] /", 2);
                if(parts2.length < 2) continue;
                String pinyin = parts2[0].replace("[", "").trim();
                String meaning = java.util.Arrays.stream(parts2[1].split("/"))
                      .map(String::trim)
                      .filter(s -> !s.isEmpty())
                      .collect(java.util.stream.Collectors.joining(", "));
                
                meaning = meaning.replaceAll("[\\u4E00-\\u9FA5]+", "")
                                 .replaceAll("\\s*\\[[a-zA-Z0-9\\s]*\\]", "")
                                 .trim();
                dictMap.put(simplified + "|" + pinyin, meaning);
            }
            log.info("Loaded {} definitions. Updating DB...", dictMap.size());
            
            int batchSize = 5000;
            org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, batchSize);
            Page<Word> page;
            int count = 0;
            do {
                page = wordRepository.findAll(pageable);
                for (Word w : page.getContent()) {
                    String key = w.getHanzi() + "|" + w.getPinyin();
                    String correctMeaning = dictMap.get(key);
                    if (correctMeaning != null && !correctMeaning.equals(w.getMeaning())) {
                        w.setMeaning(correctMeaning);
                    }
                }
                wordRepository.saveAll(page.getContent());
                count += page.getNumberOfElements();
                log.info("Fixed {} words in DB...", count);
                pageable = pageable.next();
            } while (page.hasNext());
            
            log.info("Dictionary meaning fix completed successfully!");
        } catch (Exception e){
            log.error("Error fixing dictionary: " + dictionaryFilePath, e);
        }
    }
}
