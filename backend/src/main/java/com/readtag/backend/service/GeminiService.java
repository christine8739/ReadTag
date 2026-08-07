package com.readtag.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 해시태그 목록을 전달받아 Gemini AI에게 맞춤 도서 추천 및 한 줄 평 생성을 요청합니다.
    public String askGemini(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return "선택하신 해시태그에 맞춘 AI 독서 처방전입니다.";
        }

        try {
            String requestUrl = apiUrl + "?key=" + apiKey;

            String promptText = String.format(
                "당신은 독서 자판기 AI 전문가입니다. 사용자가 선택한 해시태그 %s에 어울리는 따뜻하고 명확한 독서 처방전 한 줄 평(70자 이내)을 작성해 주세요.",
                tags.toString()
            );

            Map<String, Object> part = Map.of("text", promptText);
            Map<String, Object> content = Map.of("parts", List.of(part));
            Map<String, Object> requestBody = Map.of("contents", List.of(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                requestUrl,
                HttpMethod.POST,
                entity,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map body = response.getBody();
                if (body.containsKey("candidates")) {
                    List candidates = (List) body.get("candidates");
                    if (candidates != null && !candidates.isEmpty()) {
                        Map firstCandidate = (Map) candidates.get(0);
                        Map contentObj = (Map) firstCandidate.get("content");
                        if (contentObj != null && contentObj.containsKey("parts")) {
                            List parts = (List) contentObj.get("parts");
                            if (parts != null && !parts.isEmpty()) {
                                Map firstPart = (Map) parts.get(0);
                                String text = (String) firstPart.get("text");
                                if (text != null && !text.isBlank()) {
                                    return text.trim();
                                }
                            }
                        }
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("Gemini API 호출 실패 (Fallback 사용): " + e.getMessage());
        }

        // Gemini API 호출 실패 시 태그 기반 지능형 기본 처방 문구 생성
        return String.format("선택하신 %s 태그의 감성에 맞춘 독서 처방전입니다. 깊은 몰입과 마음의 평온을 얻으시길 바랍니다.", String.join(", ", tags));
    }
}