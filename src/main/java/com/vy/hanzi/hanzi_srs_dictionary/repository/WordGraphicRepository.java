package com.vy.hanzi.hanzi_srs_dictionary.repository;

import com.vy.hanzi.hanzi_srs_dictionary.entity.WordGraphic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WordGraphicRepository extends JpaRepository<WordGraphic, Long> {
    List<WordGraphic> findByWordIdOrderByGifOrderAsc(Long wordId);
}
