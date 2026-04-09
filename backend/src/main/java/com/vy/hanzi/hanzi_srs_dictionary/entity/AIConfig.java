package com.vy.hanzi.hanzi_srs_dictionary.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "AI_config")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIConfig {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    private String apiKey;
    private String model;
    private String systemPrompt;
    private Boolean is_active;
}
