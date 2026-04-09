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
        Page<Word> words = wordRepository.findByMeaningContainingIgnoreCaseOrPinyinContainingIgnoreCaseOrHanziContainingIgnoreCase(
                keyword,
                keyword,
                keyword,
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
        if (hskLevel == null || types == null || types.isEmpty()) {
            throw new BadRequestException("hskLevel and types are required");
        }

        List<String> normalizedTypes = types.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(type -> !type.isEmpty())
                .toList();

        if (normalizedTypes.isEmpty()) {
            throw new BadRequestException("types must contain at least one non-empty value");
        }

        return wordRepository.findByHskLevelAndTypes_NameIn(hskLevel, normalizedTypes)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public Page<WordResponseDTO> getWordsByHskAndTypesPaged(Integer hskLevel, List<String> types, Pageable pageable) {
        if (hskLevel == null || types == null || types.isEmpty()) {
            throw new BadRequestException("hskLevel and types are required");
        }

        List<String> normalizedTypes = types.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(type -> !type.isEmpty())
                .toList();

        if (normalizedTypes.isEmpty()) {
            throw new BadRequestException("types must contain at least one non-empty value");
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
                String meaning = parts2[1].replace("/", "").trim();
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
}
