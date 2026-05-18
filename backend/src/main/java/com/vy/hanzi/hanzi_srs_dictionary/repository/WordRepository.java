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
    List<Word> findByHskLevel(int hskLevel);
    Page<Word> findByHskLevel(int hskLevel, Pageable pageable);
    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM words w WHERE " +
            "w.meaning LIKE CONCAT('%', :keyword, '%') OR " +
            "w.hanzi LIKE CONCAT('%', :keyword, '%') OR " +
            "w.pinyin LIKE CONCAT('%', :strippedPinyin, '%') " +
            "ORDER BY " +
            "CASE WHEN w.hsk_level IS NOT NULL THEN w.hsk_level ELSE 99 END ASC, " +
            "LENGTH(w.hanzi) ASC",
            countQuery = "SELECT count(*) FROM words w WHERE " +
            "w.meaning LIKE CONCAT('%', :keyword, '%') OR " +
            "w.hanzi LIKE CONCAT('%', :keyword, '%') OR " +
            "w.pinyin LIKE CONCAT('%', :strippedPinyin, '%')",
            nativeQuery = true)
    Page<Word> searchWordsFlexible(
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            @org.springframework.data.repository.query.Param("strippedPinyin") String strippedPinyin,
            Pageable pageable
    );
    List<Word> findByHanziIn(Collection<String> hanziList);
    List<Word> findTop50BySearchHistories_User_IdOrderBySearchHistories_CreatedAtDesc(Long userId);
    Page<Word> findTop50BySearchHistories_User_IdOrderBySearchHistories_CreatedAtDesc(Long userId, Pageable pageable);
    Page<Word> findByHskLevelLessThanEqualOrderByIdAsc(int hskLevel, Pageable pageable);

    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM words w WHERE " +
            "w.hanzi LIKE CONCAT('%', :keyword, '%') OR " +
            "REPLACE(LOWER(w.pinyin), ' ', '') LIKE CONCAT('%', LOWER(:strippedPinyin), '%') " +
            "ORDER BY " +
            "CASE " +
            "WHEN REPLACE(LOWER(w.pinyin), ' ', '') = LOWER(:strippedPinyin) OR w.hanzi = :keyword THEN 0 " +
            "WHEN REPLACE(LOWER(w.pinyin), ' ', '') LIKE CONCAT(LOWER(:strippedPinyin), '%') OR w.hanzi LIKE CONCAT(:keyword, '%') THEN 1 " +
            "ELSE 2 END ASC, " +
            "CASE WHEN w.hsk_level IS NOT NULL THEN w.hsk_level ELSE 99 END ASC, " +
            "LENGTH(w.hanzi) ASC",
            countQuery = "SELECT count(*) FROM words w WHERE " +
            "w.hanzi LIKE CONCAT('%', :keyword, '%') OR " +
            "REPLACE(LOWER(w.pinyin), ' ', '') LIKE CONCAT('%', LOWER(:strippedPinyin), '%')",
            nativeQuery = true)
    Page<Word> suggestWords(
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            @org.springframework.data.repository.query.Param("strippedPinyin") String strippedPinyin,
            Pageable pageable
    );
}
