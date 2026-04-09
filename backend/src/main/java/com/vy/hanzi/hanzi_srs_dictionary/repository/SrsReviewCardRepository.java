package com.vy.hanzi.hanzi_srs_dictionary.repository;

import com.vy.hanzi.hanzi_srs_dictionary.entity.SrsReviewCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SrsReviewCardRepository extends JpaRepository<SrsReviewCard, Long> {
    Optional<SrsReviewCard> findByUserIdAndWordId(Long userId, Long wordId);

    List<SrsReviewCard> findByUserIdAndNextReviewAtLessThanEqualOrderByNextReviewAtAsc(Long userId, LocalDateTime now);

    List<SrsReviewCard> findByUserIdOrderByNextReviewAtAsc(Long userId);
}
