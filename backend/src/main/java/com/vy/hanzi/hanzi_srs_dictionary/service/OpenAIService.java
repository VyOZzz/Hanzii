package com.vy.hanzi.hanzi_srs_dictionary.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.vy.hanzi.hanzi_srs_dictionary.entity.AIConfig;
import com.vy.hanzi.hanzi_srs_dictionary.repository.AIConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "ai.provider", havingValue = "openai")
public class OpenAIService implements AIAssistantService {
    private static final Pattern HSK_LEVEL_PATTERN = Pattern.compile("\\b([1-9])\\b");
    private static final String DEFAULT_API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String DEFAULT_MODEL = "gpt-4o-mini";

    @Value("${openai.api.key:YOUR_OPENAI_API_KEY_HERE}")
    private String apiKey;

    @Value("${openai.api.url:" + DEFAULT_API_URL + "}")
    private String apiUrl;

    @Value("${openai.model:" + DEFAULT_MODEL + "}")
    private String model;

    private final AIConfigRepository aiConfigRepository;
    private final RestTemplate restTemplate = createRestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String chatWithTutor(String userMessage) {
        AIConfig activeConfig = getActiveConfig();
        String configuredApiKey = resolveApiKey(activeConfig);
        if (configuredApiKey == null || configuredApiKey.isBlank() || "YOUR_OPENAI_API_KEY_HERE".equals(configuredApiKey)) {
            return "Vui lòng cấu hình OPENAI API Key trong file application.properties để sử dụng tính năng Gia Sư AI nhé!";
        }

        try {
            ObjectNode payload = objectMapper.createObjectNode();
            payload.put("model", resolveModel(activeConfig));

            ArrayNode messages = payload.putArray("messages");
            messages.addObject()
                    .put("role", "system")
                    .put("content", "Bạn là một gia sư tiếng Trung chuyên nghiệp và thân thiện tên là Hanzii. Hãy trò chuyện với người học, sửa lỗi ngữ pháp tiếng Trung của họ một cách nhẹ nhàng nếu có, giải thích rõ ràng và giúp họ cải thiện. Luôn trả lời song ngữ (Tiếng Việt và Tiếng Trung có pinyin nếu cần). Giữ câu trả lời ngắn gọn, súc tích và mang tính khích lệ.");
            messages.addObject().put("role", "user").put("content", userMessage == null ? "" : userMessage);

            payload.put("temperature", 0.7);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(configuredApiKey);

            HttpEntity<String> requestEntity = new HttpEntity<>(objectMapper.writeValueAsString(payload), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode contentNode = root.path("choices").path(0).path("message").path("content");
                if (!contentNode.isMissingNode()) {
                    String content = contentNode.asText("").trim();
                    if (!content.isEmpty()) {
                        return content;
                    }
                }
            }

            return "Xin lỗi, gia sư AI đang gặp sự cố kết nối. Vui lòng thử lại sau.";
        } catch (Exception e) {
            log.error("Error communicating with OpenAI API", e);
            return "Đã xảy ra lỗi khi kết nối với AI: " + e.getMessage();
        }
    }

    @Override
    public Integer classifyHskLevel(String hanzi, String pinyin, String meaning) {
        AIConfig activeConfig = getActiveConfig();
        String configuredApiKey = resolveApiKey(activeConfig);
        if (configuredApiKey == null || configuredApiKey.isBlank() || "YOUR_OPENAI_API_KEY_HERE".equals(configuredApiKey)) {
            return null;
        }

        try {
            ObjectNode payload = objectMapper.createObjectNode();
            payload.put("model", resolveModel(activeConfig));

            ArrayNode messages = payload.putArray("messages");
            messages.addObject()
                    .put("role", "system")
                    .put("content", "Ban la chuyen gia phan trinh do HSK. Nhiem vu: dua ra mot so duy nhat tu 1 den 9 cho do kho tu vung. Chi tra ve mot ky tu so duy nhat, khong them giai thich.");
            messages.addObject()
                    .put("role", "user")
                    .put("content", "Hay xep trinh do HSK cho tu sau:\n" +
                            "Hanzi: " + safe(hanzi) + "\n" +
                            "Pinyin: " + safe(pinyin) + "\n" +
                            "Nghia tieng Viet: " + safe(meaning) + "\n\n" +
                            "Chi tra ve mot so 1-9.");

            payload.put("temperature", 0.0);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(configuredApiKey);

            HttpEntity<String> requestEntity = new HttpEntity<>(objectMapper.writeValueAsString(payload), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String text = root.path("choices").path(0).path("message").path("content").asText("").trim();
                if (!text.isEmpty()) {
                    Matcher matcher = HSK_LEVEL_PATTERN.matcher(text);
                    if (matcher.find()) {
                        return Integer.parseInt(matcher.group(1));
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error classifying HSK level with OpenAI", e);
        }

        return null;
    }

    private RestTemplate createRestTemplate() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(10));
        requestFactory.setReadTimeout(Duration.ofSeconds(30));
        return new RestTemplate(requestFactory);
    }

    private AIConfig getActiveConfig() {
        return aiConfigRepository.findTopByOrderByIdDesc()
                .filter(config -> !Boolean.FALSE.equals(config.getIs_active()))
                .orElse(null);
    }

    private String resolveApiKey(AIConfig activeConfig) {
        if (activeConfig != null && activeConfig.getApiKey() != null && !activeConfig.getApiKey().isBlank()) {
            return activeConfig.getApiKey().trim();
        }
        return apiKey;
    }

    private String resolveModel(AIConfig activeConfig) {
        if (activeConfig != null && activeConfig.getModel() != null && !activeConfig.getModel().isBlank()) {
            return activeConfig.getModel().trim();
        }
        return model;
    }

    private String safe(String input) {
        return input == null ? "" : input;
    }
}
