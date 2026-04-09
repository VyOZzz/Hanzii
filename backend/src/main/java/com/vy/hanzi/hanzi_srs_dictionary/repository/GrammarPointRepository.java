package com.vy.hanzi.hanzi_srs_dictionary.repository;

import com.vy.hanzi.hanzi_srs_dictionary.entity.GrammarPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrammarPointRepository extends JpaRepository<GrammarPoint, Long> {
    List<GrammarPoint> findByHskLevel(Integer hskLevel);
}
