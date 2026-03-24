package com.vy.hanzi.hanzi_srs_dictionary.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "word_graphic")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WordGraphic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gif_url", nullable = false, columnDefinition = "TEXT")
    private String gifUrl;
    @Column(name ="gif_order")
    private Integer gifOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id", nullable = false)
    private Word word;
}
