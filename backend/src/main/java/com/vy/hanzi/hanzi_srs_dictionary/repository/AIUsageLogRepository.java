package com.vy.hanzi.hanzi_srs_dictionary.repository;

import com.vy.hanzi.hanzi_srs_dictionary.entity.AIUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AIUsageLogRepository extends JpaRepository<AIUsageLog, Long> {
    long countByFeature(String feature);

    @Query("select function('date', a.calledAt), count(a) from AIUsageLog a group by function('date', a.calledAt) order by function('date', a.calledAt) desc")
    List<Object[]> countByDay();

    @Query("select a.userId, count(a) from AIUsageLog a group by a.userId order by count(a) desc")
    List<Object[]> topUserUsage();
}
