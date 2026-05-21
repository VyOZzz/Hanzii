package com.vy.hanzi.hanzi_srs_dictionary.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ai_usage_logs")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIUsageLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 40)
    private String feature;

    @Column(nullable = false)
    private LocalDateTime calledAt;

    @Column(nullable = false)
    @Builder.Default
    private Integer tokenCount = 0;
}
