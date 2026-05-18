package com.vy.hanzi.hanzi_srs_dictionary.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@ConditionalOnProperty(name = "ai.provider", havingValue = "gemini", matchIfMissing = true)
public class GeminiService implements AIAssistantService {
    private static final Pattern HSK_LEVEL_PATTERN = Pattern.compile("\\b([1-9])\\b");

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String chatWithTutor(String userMessage) {
        if (apiKey == null || apiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            return "Vui lòng cấu hình API Key của Google Gemini trong file application.properties để sử dụng tính năng Gia Sư AI nhé!";
        }

        try {
            // Build the payload using Jackson
            ObjectNode payload = objectMapper.createObjectNode();

            // System Instructions
            ObjectNode systemInstruction = payload.putObject("systemInstruction");
            systemInstruction.put("role", "user");
            ArrayNode sysParts = systemInstruction.putArray("parts");
            sysParts.addObject().put("text", "Bạn là một gia sư tiếng Trung chuyên nghiệp và thân thiện tên là Hanzii. Hãy trò chuyện với người học, sửa lỗi ngữ pháp tiếng Trung của họ một cách nhẹ nhàng nếu có, giải thích rõ ràng và giúp họ cải thiện. Luôn trả lời song ngữ (Tiếng Việt và Tiếng Trung có pinyin nếu cần). Giữ câu trả lời ngắn gọn, súc tích và mang tính khích lệ.");

            // User Message
            ArrayNode contents = payload.putArray("contents");
            ObjectNode content = contents.addObject();
            content.put("role", "user");
            ArrayNode parts = content.putArray("parts");
            parts.addObject().put("text", userMessage);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> requestEntity = new HttpEntity<>(objectMapper.writeValueAsString(payload), headers);
            String url = apiUrl + "?key=" + apiKey;

            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

            // Parse response
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                ObjectNode resNode = (ObjectNode) objectMapper.readTree(response.getBody());
                ArrayNode candidates = (ArrayNode) resNode.get("candidates");
                if (candidates != null && candidates.size() > 0) {
                    ObjectNode firstCandidate = (ObjectNode) candidates.get(0);
                    ObjectNode contentRes = (ObjectNode) firstCandidate.get("content");
                    ArrayNode partsRes = (ArrayNode) contentRes.get("parts");
                    if (partsRes != null && partsRes.size() > 0) {
                        return partsRes.get(0).get("text").asText();
                    }
                }
            }

            return "Xin lỗi, gia sư AI đang gặp sự cố kết nối. Vui lòng thử lại sau.";
        } catch (Exception e) {
            log.error("Error communicating with Gemini API", e);
            return "Đã xảy ra lỗi khi kết nối với AI: " + e.getMessage();
        }
    }

    @Override
    public Integer classifyHskLevel(String hanzi, String pinyin, String meaning) {
        if (apiKey == null || apiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            return null;
        }

        try {
            ObjectNode payload = objectMapper.createObjectNode();

            ObjectNode systemInstruction = payload.putObject("systemInstruction");
            systemInstruction.put("role", "user");
            ArrayNode sysParts = systemInstruction.putArray("parts");
            sysParts.addObject().put("text",
                    "Ban la chuyen gia phan trinh do HSK. " +
                    "Nhiem vu: dua ra mot so duy nhat tu 1 den 9 cho do kho tu vung. " +
                    "Chi tra ve mot ky tu so duy nhat, khong them giai thich.");

            ArrayNode contents = payload.putArray("contents");
            ObjectNode content = contents.addObject();
            content.put("role", "user");
            ArrayNode parts = content.putArray("parts");
            parts.addObject().put("text",
                    "Hay xep trinh do HSK cho tu sau:\n" +
                            "Hanzi: " + safe(hanzi) + "\n" +
                            "Pinyin: " + safe(pinyin) + "\n" +
                            "Nghia tieng Viet: " + safe(meaning) + "\n\n" +
                            "Chi tra ve mot so 1-9.");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> requestEntity = new HttpEntity<>(objectMapper.writeValueAsString(payload), headers);
            String url = apiUrl + "?key=" + apiKey;
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                ObjectNode resNode = (ObjectNode) objectMapper.readTree(response.getBody());
                ArrayNode candidates = (ArrayNode) resNode.get("candidates");
                if (candidates != null && candidates.size() > 0) {
                    ObjectNode firstCandidate = (ObjectNode) candidates.get(0);
                    ObjectNode contentRes = (ObjectNode) firstCandidate.get("content");
                    ArrayNode partsRes = (ArrayNode) contentRes.get("parts");
                    if (partsRes != null && partsRes.size() > 0) {
                        String text = partsRes.get(0).get("text").asText("").trim();
                        Matcher matcher = HSK_LEVEL_PATTERN.matcher(text);
                        if (matcher.find()) {
                            return Integer.parseInt(matcher.group(1));
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error classifying HSK level with Gemini", e);
        }

        return null;
    }

    private String safe(String input) {
        return input == null ? "" : input;
    }
}
