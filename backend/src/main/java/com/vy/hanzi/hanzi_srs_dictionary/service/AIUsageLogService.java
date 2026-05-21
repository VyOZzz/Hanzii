package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.vy.hanzi.hanzi_srs_dictionary.entity.AIUsageLog;
import com.vy.hanzi.hanzi_srs_dictionary.repository.AIUsageLogRepository;
import com.vy.hanzi.hanzi_srs_dictionary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIUsageLogService {
    private final AIUsageLogRepository aiUsageLogRepository;
    private final UserRepository userRepository;

    public void log(Long userId, String feature, int tokenCount) {
        if (userId == null) {
            return;
        }
        aiUsageLogRepository.save(AIUsageLog.builder()
                .userId(userId)
                .feature(feature)
                .calledAt(LocalDateTime.now())
                .tokenCount(Math.max(tokenCount, 0))
                .build());
    }

    public Map<String, Object> buildStats() {
        Map<String, Object> out = new HashMap<>();
        long chatCalls = aiUsageLogRepository.countByFeature("CHAT");
        long classifyCalls = aiUsageLogRepository.countByFeature("CLASSIFY");
        long totalCalls = chatCalls + classifyCalls;
        out.put("totalCalls", totalCalls);
        out.put("chatCalls", chatCalls);
        out.put("classifyCalls", classifyCalls);

        List<Map<String, Object>> byDay = aiUsageLogRepository.countByDay().stream().map(row -> {
            Map<String, Object> item = new HashMap<>();
            item.put("date", String.valueOf(row[0]));
            item.put("calls", ((Number) row[1]).longValue());
            return item;
        }).toList();
        out.put("callsByDay", byDay);

        List<Map<String, Object>> topUsers = aiUsageLogRepository.topUserUsage().stream().limit(5).map(row -> {
            Long uid = ((Number) row[0]).longValue();
            String username = userRepository.findById(uid).map(u -> u.getUsername()).orElse("unknown");
            Map<String, Object> item = new HashMap<>();
            item.put("userId", uid);
            item.put("username", username);
            item.put("calls", ((Number) row[1]).longValue());
            return item;
        }).toList();
        out.put("topUsers", topUsers);
        return out;
    }
}
