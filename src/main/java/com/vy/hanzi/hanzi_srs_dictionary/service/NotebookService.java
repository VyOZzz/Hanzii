package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.CreateNotebookRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.NotebookResponseDTO;
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

@Service
@RequiredArgsConstructor
public class NotebookService {
    private final NotebookRepository notebookRepository;
    private final UserRepository userRepository;
    private final WordRepository wordRepository;

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

        return toDto(refreshedNotebook);
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
}
