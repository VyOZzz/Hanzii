package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.SrsAddWordRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.SrsReviewCardResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.SrsReviewSubmitRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.SrsReviewCard;
import com.vy.hanzi.hanzi_srs_dictionary.entity.User;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Word;
import com.vy.hanzi.hanzi_srs_dictionary.exception.BadRequestException;
import com.vy.hanzi.hanzi_srs_dictionary.exception.NotFoundException;
import com.vy.hanzi.hanzi_srs_dictionary.repository.SrsReviewCardRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.UserRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SrsService {
    private final SrsReviewCardRepository srsReviewCardRepository;
    private final UserRepository userRepository;
    private final WordRepository wordRepository;

    public SrsReviewCardResponseDTO addWordToSrs(SrsAddWordRequestDTO request) {
        if (request.getUserId() == null || request.getWordId() == null) {
            throw new BadRequestException("userId and wordId are required");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found with id: " + request.getUserId()));
        Word word = wordRepository.findById(request.getWordId())
                .orElseThrow(() -> new NotFoundException("Word not found with id: " + request.getWordId()));

        SrsReviewCard card = srsReviewCardRepository
                .findByUserIdAndWordId(request.getUserId(), request.getWordId())
                .orElseGet(() -> SrsReviewCard.builder()
                        .user(user)
                        .word(word)
                        .repetition(0)
                        .intervalDays(0)
                        .nextReviewAt(LocalDateTime.now())
                        .build());

        return toDto(srsReviewCardRepository.save(card));
    }

    public List<SrsReviewCardResponseDTO> getDueCards(Long userId) {
        ensureUserExists(userId);
        LocalDateTime now = LocalDateTime.now();

        return srsReviewCardRepository
                .findByUserIdAndNextReviewAtLessThanEqualOrderByNextReviewAtAsc(userId, now)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<SrsReviewCardResponseDTO> getAllCards(Long userId) {
        ensureUserExists(userId);
        return srsReviewCardRepository.findByUserIdOrderByNextReviewAtAsc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    public SrsReviewCardResponseDTO submitReview(SrsReviewSubmitRequestDTO request) {
        if (request.getUserId() == null || request.getWordId() == null) {
            throw new BadRequestException("userId and wordId are required");
        }

        SrsReviewCard card = srsReviewCardRepository.findByUserIdAndWordId(request.getUserId(), request.getWordId())
                .orElseThrow(() -> new NotFoundException("SRS card not found for userId=" + request.getUserId() + ", wordId=" + request.getWordId()));

        int nextRepetition;
        int nextIntervalDays;

        if (request.isRemembered()) {
            nextRepetition = card.getRepetition() + 1;
            if (nextRepetition == 1) {
                nextIntervalDays = 1;
            } else if (nextRepetition == 2) {
                nextIntervalDays = 3;
            } else {
                nextIntervalDays = card.getIntervalDays() * 2;
                if (nextIntervalDays < 1) {
                    nextIntervalDays = 1;
                }
            }
        } else {
            nextRepetition = 0;
            nextIntervalDays = 1;
        }

        LocalDateTime now = LocalDateTime.now();
        card.setRepetition(nextRepetition);
        card.setIntervalDays(nextIntervalDays);
        card.setLastReviewedAt(now);
        card.setNextReviewAt(now.plusDays(nextIntervalDays));

        return toDto(srsReviewCardRepository.save(card));
    }

    private void ensureUserExists(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));
    }

    private SrsReviewCardResponseDTO toDto(SrsReviewCard card) {
        return SrsReviewCardResponseDTO.builder()
                .cardId(card.getId())
                .userId(card.getUser().getId())
                .wordId(card.getWord().getId())
                .hanzi(card.getWord().getHanzi())
                .pinyin(card.getWord().getPinyin())
                .meaning(card.getWord().getMeaning())
                .repetition(card.getRepetition())
                .intervalDays(card.getIntervalDays())
                .nextReviewAt(card.getNextReviewAt())
                .build();
    }
}
