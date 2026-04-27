package com.vy.hanzi.hanzi_srs_dictionary.repository;

import com.vy.hanzi.hanzi_srs_dictionary.entity.Word;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface WordRepository extends JpaRepository<Word, Long> {
    List<Word> findTop100ByOrderByHskLevelAscIdAsc();
    List<Word> findByHskLevelAndTypes_NameIn(int hskLevel, Collection<String> types);
    Page<Word> findByHskLevelAndTypes_NameIn(int hskLevel, Collection<String> types, Pageable pageable);
    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM words w WHERE " +
            "LOWER(w.meaning) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(w.hanzi) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(w.pinyin, '1', ''), '2', ''), '3', ''), '4', ''), '5', ''), ' ', '')) LIKE LOWER(CONCAT('%', :strippedPinyin, '%'))",
            countQuery = "SELECT count(*) FROM words w WHERE " +
            "LOWER(w.meaning) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(w.hanzi) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(w.pinyin, '1', ''), '2', ''), '3', ''), '4', ''), '5', ''), ' ', '')) LIKE LOWER(CONCAT('%', :strippedPinyin, '%'))",
            nativeQuery = true)
    Page<Word> searchWordsFlexible(
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            @org.springframework.data.repository.query.Param("strippedPinyin") String strippedPinyin,
            Pageable pageable
    );
    List<Word> findByHanziIn(Collection<String> hanziList);
    List<Word> findTop50BySearchHistories_User_IdOrderBySearchHistories_CreatedAtDesc(Long userId);
    Page<Word> findTop50BySearchHistories_User_IdOrderBySearchHistories_CreatedAtDesc(Long userId, Pageable pageable);



}
