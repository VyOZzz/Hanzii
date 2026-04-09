package com.vy.hanzi.hanzi_srs_dictionary.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "translations")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Translation {
    @Id
    @GeneratedValue (strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_text", nullable = false, columnDefinition = "TEXT")
    private String sourceText;
    @Column(name = "translated_text", nullable = false, columnDefinition = "TEXT")
    private String translatedText;
    @Column(name = "source_language", nullable = false, length = 50)
    private String sourceLanguage;
    @Column(name = "target_language", nullable = false, length = 50)
    private String targetLanguage;
    @Column(name = "created_at", nullable = false)
    private java.time.LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
