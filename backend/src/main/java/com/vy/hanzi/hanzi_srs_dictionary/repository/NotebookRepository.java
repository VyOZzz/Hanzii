package com.vy.hanzi.hanzi_srs_dictionary.repository;

import com.vy.hanzi.hanzi_srs_dictionary.entity.Notebook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotebookRepository extends JpaRepository<Notebook, Long> {
    List<Notebook> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Notebook> findByIdAndUserId(Long id, Long userId);

    @Query("""
            select count(n)
            from Notebook n
            join n.words w
            where n.user.id = :userId and w.id = :wordId
            """)
    long countByUserIdAndWordId(@Param("userId") Long userId, @Param("wordId") Long wordId);
}
