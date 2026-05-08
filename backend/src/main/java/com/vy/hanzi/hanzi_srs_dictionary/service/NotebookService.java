package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.CreateNotebookRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.NotebookResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.WordResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Notebook;
import com.vy.hanzi.hanzi_srs_dictionary.entity.User;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Word;
import com.vy.hanzi.hanzi_srs_dictionary.exception.BadRequestException;
import com.vy.hanzi.hanzi_srs_dictionary.exception.NotFoundException;
import com.vy.hanzi.hanzi_srs_dictionary.repository.NotebookRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.UserRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.vy.hanzi.hanzi_srs_dictionary.entity.SrsReviewCard;
import com.vy.hanzi.hanzi_srs_dictionary.repository.SrsReviewCardRepository;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class NotebookService {
    private final NotebookRepository notebookRepository;
    private final UserRepository userRepository;
    private final WordRepository wordRepository;
    private final SrsReviewCardRepository srsReviewCardRepository;
    private final GeminiService geminiService;

    @Transactional
    public NotebookResponseDTO createNotebook(CreateNotebookRequestDTO request) {
        if (request == null || request.getTitle() == null || request.getTitle().isBlank()) {
            throw new BadRequestException("Notebook title is required");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found with id: " + request.getUserId()));

        Notebook notebook = Notebook.builder()
                .title(request.getTitle().trim())
                .createdAt(LocalDateTime.now())
                .user(user)
                .words(new ArrayList<>())
                .build();

        return toDto(notebookRepository.save(notebook));
    }

    public List<NotebookResponseDTO> getNotebooksByUser(Long userId) {
        return notebookRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public NotebookResponseDTO addWordToNotebook(Long userId, Long notebookId, Long wordId) {
        Notebook notebook = notebookRepository.findByIdAndUserId(notebookId, userId)
                .orElseThrow(() -> new NotFoundException("Notebook not found with id: " + notebookId));

        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new NotFoundException("Word not found with id: " + wordId));

        List<Notebook> notebooks = word.getNotebooks() == null ? new ArrayList<>() : word.getNotebooks();
        boolean exists = notebooks.stream().anyMatch(existing -> existing.getId().equals(notebookId));
        if (!exists) {
            notebooks.add(notebook);
        }
        word.setNotebooks(notebooks);

        Word saved = wordRepository.save(word);
        Notebook refreshedNotebook = saved.getNotebooks().stream()
                .filter(existing -> existing.getId().equals(notebookId))
                .findFirst()
                .orElse(notebook);

        // --- Personalize AI Custom Examples ---
        // Ensure SRS card exists, then generate examples in the background
        SrsReviewCard card = srsReviewCardRepository.findByUserIdAndWordId(userId, wordId)
                .orElseGet(() -> SrsReviewCard.builder()
                        .user(userRepository.getReferenceById(userId))
                        .word(saved)
                        .repetition(0)
                        .intervalDays(0)
                        .nextReviewAt(LocalDateTime.now())
                        .build());
        
        if (card.getCustomExamples() == null || card.getCustomExamples().isBlank()) {
            srsReviewCardRepository.save(card);
            CompletableFuture.runAsync(() -> {
                String prompt = String.format("Tạo 3 câu ví dụ tiếng Trung giao tiếp thực tế chứa từ '%s' (pinyin: %s, nghĩa: %s), phù hợp với người học ở cấp độ HSK %s hoặc theo sở thích thông thường (ví dụ: du lịch, công việc). Định dạng: Hán tự - Pinyin - Dịch nghĩa tiếng Việt.", 
                        saved.getHanzi(), saved.getPinyin(), saved.getMeaning(), saved.getHskLevel() > 0 ? String.valueOf(saved.getHskLevel()) : "cơ bản");
                String aiExamples = geminiService.chatWithTutor(prompt);
                card.setCustomExamples(aiExamples);
                srsReviewCardRepository.save(card);
            });
        }

        return toDto(refreshedNotebook);
    }

    @Transactional
    public NotebookResponseDTO removeWordFromNotebook(Long userId, Long notebookId, Long wordId) {
        Notebook notebook = notebookRepository.findByIdAndUserId(notebookId, userId)
                .orElseThrow(() -> new NotFoundException("Notebook not found with id: " + notebookId));

        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new NotFoundException("Word not found with id: " + wordId));

        if (word.getNotebooks() != null) {
            boolean removed = word.getNotebooks().removeIf(existing -> existing.getId().equals(notebookId));
            if (removed) {
                wordRepository.save(word);
            }
        }

        // Return the updated notebook state
        return toDto(notebook);
    }

    /**
     * Get all words in a notebook with full word detail.
     */
    @Transactional(readOnly = true)
    public List<WordResponseDTO> getNotebookWords(Long userId, Long notebookId) {
        Notebook notebook = notebookRepository.findByIdAndUserId(notebookId, userId)
                .orElseThrow(() -> new NotFoundException("Notebook not found with id: " + notebookId));

        List<Word> words = notebook.getWords();
        if (words == null || words.isEmpty()) {
            return List.of();
        }

        return words.stream().map(this::toWordDto).toList();
    }

    private NotebookResponseDTO toDto(Notebook notebook) {
        return NotebookResponseDTO.builder()
                .id(notebook.getId())
                .title(notebook.getTitle())
                .createdAt(notebook.getCreatedAt())
                .userId(notebook.getUser() == null ? null : notebook.getUser().getId())
                .wordIds(notebook.getWords() == null ? List.of() : notebook.getWords().stream().map(Word::getId).toList())
                .build();
    }

    private WordResponseDTO toWordDto(Word word) {
        return WordResponseDTO.builder()
                .id(word.getId())
                .hanzi(word.getHanzi())
                .pinyin(word.getPinyin())
                .meaning(word.getMeaning())
                .sinoVietnamese(word.getSinoVietnamese())
                .hskLevel(word.getHskLevel())
                .strokeCount(word.getStrokeCount())
                .audioUrl(word.getAudioUrl())
                .wordTypes(word.getTypes() == null ? List.of() : word.getTypes().stream().map(t -> t.getName()).toList())
                .build();
    }
}
