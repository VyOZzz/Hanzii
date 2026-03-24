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
    Page<Word> findByMeaningContainingIgnoreCaseOrPinyinContainingIgnoreCase(String meaningKeyword, String pinyinKeyword, Pageable pageable);
    List<Word> findByHanziIn(Collection<String> hanziList);
    List<Word> findTop50BySearchHistories_User_IdOrderBySearchHistories_CreatedAtDesc(Long userId);



}
