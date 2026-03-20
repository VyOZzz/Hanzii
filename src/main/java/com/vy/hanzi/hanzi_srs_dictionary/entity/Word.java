package com.vy.hanzi.hanzi_srs_dictionary.entity;

import jakarta.persistence.*;
import lombok.Data;

import javax.annotation.processing.Generated;

@Entity
@Table(name = "words")
@Data
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
    @Column()
}
