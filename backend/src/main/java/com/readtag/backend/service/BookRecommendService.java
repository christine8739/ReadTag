package com.readtag.backend.service;

import com.readtag.backend.dto.request.RecommendRequestDto;
import com.readtag.backend.dto.response.BookResponseDto;
import com.readtag.backend.dto.response.PrescriptionResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookRecommendService {

    private final AladinBookService aladinBookService;
    private final GeminiService geminiService;

    public PrescriptionResponseDto recommend(RecommendRequestDto requestDto) {
        List<String> inputTags = requestDto.getTags() != null ? requestDto.getTags() : List.of();

        // 1. 선택한 해시태그 목록을 분석하여 알라딘 OpenAPI 실시간 도서 검색 키워드 매핑
        List<BookResponseDto> aladinBooks = new ArrayList<>();
        
        for (String tag : inputTags) {
            String keyword = mapTagToAladinKeyword(tag);
            List<BookResponseDto> results = aladinBookService.searchBooksKeyword(keyword);
            if (results != null && !results.isEmpty()) {
                aladinBooks.addAll(results);
            }
        }

        // 검색 결과가 없으면 알라딘 베스트셀러 목록에서 가져옴
        if (aladinBooks.isEmpty()) {
            aladinBooks = aladinBookService.getBestsellers();
        }

        if (aladinBooks.isEmpty()) {
            return PrescriptionResponseDto.builder().build();
        }

        // 중복 도서 제거
        List<BookResponseDto> distinctBooks = aladinBooks.stream()
                .filter(b -> b != null && b.getTitle() != null)
                .collect(Collectors.toMap(
                        BookResponseDto::getTitle,
                        b -> b,
                        (b1, b2) -> b1
                ))
                .values().stream().collect(Collectors.toList());

        // 2. 알라딘 OpenAPI 응답 도서 중 메인 1순위 도서 및 2순위 서브 추천 도서 구성
        BookResponseDto primaryBook = distinctBooks.get(0);
        List<BookResponseDto> secondaryBooks = distinctBooks.stream()
                .skip(1)
                .limit(2)
                .collect(Collectors.toList());

        // 3. Gemini AI를 호출하여 해시태그 맞춤 한 줄 평 처방전 생성
        String aiOneLiner = geminiService.askGemini(inputTags);
        if (aiOneLiner != null && !aiOneLiner.isBlank()) {
            primaryBook = BookResponseDto.builder()
                    .id(primaryBook.getId())
                    .title(primaryBook.getTitle())
                    .author(primaryBook.getAuthor())
                    .publisher(primaryBook.getPublisher())
                    .publishedYear(primaryBook.getPublishedYear())
                    .category(primaryBook.getCategory())
                    .coverColor(primaryBook.getCoverColor() != null ? primaryBook.getCoverColor() : "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)")
                    .oneLiner(aiOneLiner) // Gemini AI 생성 처방전 반영
                    .summary(primaryBook.getSummary())
                    .keyQuote(primaryBook.getKeyQuote() != null ? primaryBook.getKeyQuote() : primaryBook.getOneLiner())
                    .primaryTags(inputTags)
                    .derivativeTags(List.of("#알라딘추천", "#실시간OpenAPI", "#독서처방전"))
                    .build();
        }

        return PrescriptionResponseDto.builder()
                .primaryBook(primaryBook)
                .secondaryBooks(secondaryBooks)
                .derivativeTags(List.of("#알라딘추천", "#실시간OpenAPI", "#독서처방전"))
                .build();
    }

    // 감성/목표/장르 해시태그를 알라딘 API 도서 검색용 최적 검색어로 변환하는 스마트 매핑 함수
    private String mapTagToAladinKeyword(String tag) {
        if (tag == null || tag.isBlank()) return "에세이";
        String clean = tag.replace("#", "").trim();

        switch (clean) {
            case "도파민": return "도파민";
            case "번아웃극복": return "번아웃 에세이";
            case "위로가필요해": return "위로 에세이";
            case "현타": return "인생 에세이";
            case "성장통": return "성장 소설";
            case "고독한밤": return "감성 에세이";
            case "세계문학전집": return "세계문학전집";
            case "텍스트힙": return "소설 베스트셀러";
            case "커피와고전": return "고전 소설";
            case "철학한스푼": return "철학 입문";
            case "우주와사랑": return "우주 교양과학";
            case "인간관계론": return "인간관계 처세";
            case "오답노트": return "자기계발";
            case "갓생살기": return "동기부여 자기계발";
            case "몰입의즐거움": return "몰입 습관";
            case "미니멀라이프": return "미니멀 라이프";
            case "리프레시": return "마음챙김 명상";
            case "괴짜천재": return "과학 위인전";
            default:
                return clean;
        }
    }
}
