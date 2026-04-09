package com.vy.hanzi.hanzi_srs_dictionary.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Builder
@Table(name = "grammar_points")
@AllArgsConstructor
@NoArgsConstructor
public class GrammarPoint {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String structure;
    @Column(columnDefinition = "TEXT")
    private String explanation;
    private Integer hskLevel;

    @ManyToMany(mappedBy = "grammarPoints")
    private List<Word> words;

    @OneToMany(mappedBy = "grammarPoint")
    private List<GrammarExample> examples;
}
