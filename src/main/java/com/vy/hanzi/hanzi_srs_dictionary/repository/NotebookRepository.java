package com.vy.hanzi.hanzi_srs_dictionary.repository;

import com.vy.hanzi.hanzi_srs_dictionary.entity.Notebook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotebookRepository extends JpaRepository<Notebook, Long> {
}
