package com.vy.hanzi.hanzi_srs_dictionary.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.processing.Generated;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "words")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Word {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String  hanzi;
    @Column(nullable = false, length = 100)
    private String pinyin;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String meaning;
    @Column(name = "sino_vietnamese")
    private String sinoVietnamese;

    @Column(name = "hsk_level")
    private int hskLevel;
    @Column(name  = "stroke_count")
    private int strokeCount;
    @Column(name  = "audio_url")
    private String audioUrl;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "word")
    @OrderBy("gifOrder ASC")
    private java.util.List<WordGraphic> graphics;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable( name = "word_grammar",
                joinColumns = @JoinColumn(name = "word_id"),
                inverseJoinColumns = @JoinColumn(name = "grammar_point_id"))
    private List<GrammarPoint> grammarPoints;
}
