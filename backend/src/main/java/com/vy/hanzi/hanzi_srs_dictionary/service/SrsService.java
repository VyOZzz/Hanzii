package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.SrsAddWordRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.SrsReviewCardResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.SrsReviewSubmitRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Notebook;
import com.vy.hanzi.hanzi_srs_dictionary.entity.SrsReviewCard;
import com.vy.hanzi.hanzi_srs_dictionary.entity.User;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Word;
import com.vy.hanzi.hanzi_srs_dictionary.exception.BadRequestException;
import com.vy.hanzi.hanzi_srs_dictionary.exception.NotFoundException;
import com.vy.hanzi.hanzi_srs_dictionary.repository.NotebookRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.SrsReviewCardRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.UserRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SrsService {
    private final SrsReviewCardRepository srsReviewCardRepository;
    private final UserRepository userRepository;
    private final WordRepository wordRepository;
    private final NotebookRepository notebookRepository;

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
                .filter(card -> card.getWord() != null)
                .map(this::toDto)
                .toList();
    }

    public List<SrsReviewCardResponseDTO> getAllCards(Long userId) {
        ensureUserExists(userId);
        return srsReviewCardRepository.findByUserIdOrderByNextReviewAtAsc(userId).stream()
                .filter(card -> card.getWord() != null)
                .map(this::toDto)
                .toList();
    }

    /**
     * Get due SRS cards for words in a specific notebook (Anki-style deck review).
     */
    public List<SrsReviewCardResponseDTO> getDueCardsByNotebook(Long userId, Long notebookId) {
        Notebook notebook = notebookRepository.findByIdAndUserId(notebookId, userId)
                .orElseThrow(() -> new NotFoundException("Notebook not found with id: " + notebookId));

        List<Word> words = notebook.getWords();
        if (words == null || words.isEmpty()) {
            return List.of();
        }

        List<Long> wordIds = words.stream().map(Word::getId).toList();
        LocalDateTime now = LocalDateTime.now();

        return srsReviewCardRepository
                .findByUserIdAndWordIdInAndNextReviewAtLessThanEqualOrderByNextReviewAtAsc(userId, wordIds, now)
                .stream()
                .filter(card -> card.getWord() != null)
                .map(this::toDto)
                .toList();
    }

    /**
     * Get all SRS cards for words in a specific notebook (Cramming mode / Review All).
     */
    public List<SrsReviewCardResponseDTO> getAllCardsByNotebook(Long userId, Long notebookId) {
        Notebook notebook = notebookRepository.findByIdAndUserId(notebookId, userId)
                .orElseThrow(() -> new NotFoundException("Notebook not found with id: " + notebookId));

        List<Word> words = notebook.getWords();
        if (words == null || words.isEmpty()) {
            return List.of();
        }

        List<Long> wordIds = words.stream().map(Word::getId).toList();

        return srsReviewCardRepository
                .findByUserIdAndWordIdIn(userId, wordIds)
                .stream()
                .filter(card -> card.getWord() != null)
                .map(this::toDto)
                .toList();
    }

    /**
     * Ensure all words in a notebook have SRS cards (create missing ones).
     * Returns the count of newly created cards.
     */
    @Transactional
    public int ensureNotebookWordsInSrs(Long userId, Long notebookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        Notebook notebook = notebookRepository.findByIdAndUserId(notebookId, userId)
                .orElseThrow(() -> new NotFoundException("Notebook not found with id: " + notebookId));

        List<Word> words = notebook.getWords();
        if (words == null || words.isEmpty()) {
            return 0;
        }

        List<Long> wordIds = words.stream().map(Word::getId).toList();

        // Find existing SRS cards for these words
        Set<Long> existingWordIds = srsReviewCardRepository
                .findByUserIdAndWordIdIn(userId, wordIds)
                .stream()
                .map(card -> card.getWord().getId())
                .collect(Collectors.toSet());

        // Create missing cards
        List<SrsReviewCard> newCards = new ArrayList<>();
        for (Word word : words) {
            if (!existingWordIds.contains(word.getId())) {
                newCards.add(SrsReviewCard.builder()
                        .user(user)
                        .word(word)
                        .repetition(0)
                        .intervalDays(0)
                        .nextReviewAt(LocalDateTime.now())
                        .build());
            }
        }

        if (!newCards.isEmpty()) {
            srsReviewCardRepository.saveAll(newCards);
        }

        return newCards.size();
    }

    public SrsReviewCardResponseDTO submitReview(SrsReviewSubmitRequestDTO request) {
        if (request.getUserId() == null || request.getWordId() == null) {
            throw new BadRequestException("userId and wordId are required");
        }

        SrsReviewCard card = srsReviewCardRepository.findByUserIdAndWordId(request.getUserId(), request.getWordId())
                .orElseThrow(() -> new NotFoundException("SRS card not found for userId=" + request.getUserId() + ", wordId=" + request.getWordId()));

        int nextRepetition = card.getRepetition();
        int nextIntervalDays = card.getIntervalDays();

        switch (request.getRating()) {
            case 1: // Again
                nextRepetition = 0;
                nextIntervalDays = 1;
                break;
            case 2: // Hard
                if (nextRepetition == 0) {
                    nextRepetition = 1;
                }
                nextIntervalDays = Math.max(1, (int) Math.round(nextIntervalDays * 1.2));
                break;
            case 3: // Good
                nextRepetition++;
                if (nextIntervalDays == 0) {
                    nextIntervalDays = 1;
                } else {
                    nextIntervalDays = (int) Math.round(nextIntervalDays * 2.5);
                }
                break;
            case 4: // Easy
                nextRepetition++;
                if (nextIntervalDays == 0) {
                    nextIntervalDays = 4;
                } else {
                    nextIntervalDays = (int) Math.round(nextIntervalDays * 4.0);
                }
                break;
            default:
                // Fallback to Good if somehow unknown rating
                nextRepetition++;
                nextIntervalDays = Math.max(1, nextIntervalDays * 2);
                break;
        }

        LocalDateTime now = LocalDateTime.now();
        card.setRepetition(nextRepetition);
        card.setIntervalDays(nextIntervalDays);
        card.setLastReviewedAt(now);
        card.setNextReviewAt(now.plusDays(nextIntervalDays));

        return toDto(srsReviewCardRepository.save(card));
    }

    public long countByUser(Long userId) {
        return srsReviewCardRepository.countByUserId(userId);
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
                .customExamples(card.getCustomExamples())
                .build();
    }
}
