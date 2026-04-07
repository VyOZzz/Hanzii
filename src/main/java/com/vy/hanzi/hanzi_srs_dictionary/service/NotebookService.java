package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.dto.CreateNotebookRequestDTO;
import com.vy.hanzi.hanzi_srs_dictionary.dto.NotebookResponseDTO;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Notebook;
import com.vy.hanzi.hanzi_srs_dictionary.entity.User;
import com.vy.hanzi.hanzi_srs_dictionary.entity.Word;
import com.vy.hanzi.hanzi_srs_dictionary.exception.NotFoundException;
import com.vy.hanzi.hanzi_srs_dictionary.repository.NotebookRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.UserRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotebookService {
    private final NotebookRepository notebookRepository;
    private final UserRepository userRepository;
    private final WordRepository wordRepository;

    public NotebookResponseDTO createNotebook(CreateNotebookRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found with id: " + request.getUserId()));

        Notebook notebook = Notebook.builder()
                .title(request.getTitle())
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

    public NotebookResponseDTO addWordToNotebook(Long notebookId, Long wordId) {
        Notebook notebook = notebookRepository.findById(notebookId)
                .orElseThrow(() -> new NotFoundException("Notebook not found with id: " + notebookId));

        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new NotFoundException("Word not found with id: " + wordId));

        List<Word> words = notebook.getWords() == null ? new ArrayList<>() : notebook.getWords();
        boolean exists = words.stream().anyMatch(existing -> existing.getId().equals(wordId));
        if (!exists) {
            words.add(word);
        }
        notebook.setWords(words);

        return toDto(notebookRepository.save(notebook));
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
