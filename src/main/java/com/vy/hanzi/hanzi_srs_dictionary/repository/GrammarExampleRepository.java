package com.vy.hanzi.hanzi_srs_dictionary.repository;

import com.vy.hanzi.hanzi_srs_dictionary.entity.GrammarExample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrammarExampleRepository extends JpaRepository<GrammarExample, Long> {
    List<GrammarExample> findByGrammarPointId(Long grammarPointId);
}
