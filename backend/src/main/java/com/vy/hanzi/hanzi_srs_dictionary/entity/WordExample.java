package com.vy.hanzi.hanzi_srs_dictionary.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "word_example")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WordExample {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    private String content;
    private String meaning;
    private String pinyin;

    @ManyToOne
    @JoinColumn(name = "word_id", nullable = false)
    private Word word;

}
