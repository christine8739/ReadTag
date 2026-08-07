package com.readtag.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.readtag.backend.dto.response.BookResponseDto;
import com.readtag.backend.entity.Book;
import com.readtag.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AladinBookService {

    private final BookRepository bookRepository;

    @Value("${aladdin.ttb-key:${aladin.ttb-key:}}")
    private String ttbKey;

    @Value("${aladdin.search-url:${aladin.search-url:http://www.aladin.co.kr/ttb/api/ItemSearch.aspx}}")
    private String searchUrl;

    @Value("${aladdin.list-url:${aladin.list-url:http://www.aladin.co.kr/ttb/api/ItemList.aspx}}")
    private String listUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 1. 키워드 API를 사용해서 알라딘 OpenAPI 실시간 도서 검색 및 DB 저장
    @Transactional
    public List<BookResponseDto> searchBooksKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getBestsellers();
        }

        try {
            URI uri = UriComponentsBuilder.fromHttpUrl(searchUrl)
                    .queryParam("ttbkey", ttbKey)
                    .queryParam("Query", keyword)
                    .queryParam("QueryType", "Keyword")
                    .queryParam("MaxResults", 10)
                    .queryParam("start", 1)
                    .queryParam("SearchTarget", "Book")
                    .queryParam("output", "js")
                    .queryParam("Version", "20131101")
                    .build()
                    .encode(StandardCharsets.UTF_8)
                    .toUri();

            String rawResponse = restTemplate.getForObject(uri, String.class);
            Map<String, Object> response = parseAladinJson(rawResponse);

            if (response != null && response.containsKey("item")) {
                List<Map<String, Object>> itemList = (List<Map<String, Object>>) response.get("item");
                if (itemList != null && !itemList.isEmpty()) {
                    return itemList.stream()
                            .map(this::saveOrUpdateAladinBookInDb)
                            .collect(Collectors.toList());
                }
            }
        } catch (Exception e) {
            System.err.println("알라딘 API 키워드 검색 실패: " + e.getMessage());
        }

        return getBestsellers();
    }

    // 2. 알라딘 실시간 베스트셀러 도서 목록 조회 및 DB 저장
    @Transactional
    public List<BookResponseDto> getBestsellers() {
        try {
            URI uri = UriComponentsBuilder.fromHttpUrl(listUrl)
                    .queryParam("ttbkey", ttbKey)
                    .queryParam("QueryType", "Bestseller")
                    .queryParam("MaxResults", 10)
                    .queryParam("start", 1)
                    .queryParam("SearchTarget", "Book")
                    .queryParam("output", "js")
                    .queryParam("Version", "20131101")
                    .build()
                    .encode(StandardCharsets.UTF_8)
                    .toUri();

            String rawResponse = restTemplate.getForObject(uri, String.class);
            Map<String, Object> response = parseAladinJson(rawResponse);

            if (response != null && response.containsKey("item")) {
                List<Map<String, Object>> itemList = (List<Map<String, Object>>) response.get("item");
                if (itemList != null && !itemList.isEmpty()) {
                    return itemList.stream()
                            .map(this::saveOrUpdateAladinBookInDb)
                            .collect(Collectors.toList());
                }
            }
        } catch (Exception e) {
            System.err.println("알라딘 베스트셀러 API 호출 실패: " + e.getMessage());
        }

        return bookRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 알라딘 API에서 가져온 도서 데이터를 실제 DB(books 테이블)에 저장(Upsert)하고 DTO로 변환
    private BookResponseDto saveOrUpdateAladinBookInDb(Map<String, Object> item) {
        String title = (String) item.getOrDefault("title", "");
        String author = (String) item.getOrDefault("author", "");
        String publisher = (String) item.getOrDefault("publisher", "");
        String pubDate = (String) item.getOrDefault("pubDate", "");
        String publishedYear = (pubDate != null && pubDate.length() >= 4) ? pubDate.substring(0, 4) : pubDate;
        String categoryName = (String) item.getOrDefault("categoryName", "");
        String description = (String) item.getOrDefault("description", "");
        String cover = (String) item.getOrDefault("cover", "");
        String isbn = (String) item.getOrDefault("isbn13", item.getOrDefault("isbn", ""));

        Book book = bookRepository.findAll().stream()
                .filter(b -> b.getTitle() != null && b.getTitle().equalsIgnoreCase(title))
                .findFirst()
                .orElseGet(Book::new);

        book.setTitle(title);
        book.setAuthor(author);
        book.setPublisher(publisher);
        book.setPublishedYear(publishedYear);
        book.setCategory(categoryName);
        book.setCover(cover);
        if (book.getCoverColor() == null) {
            book.setCoverColor("linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)");
        }
        book.setSummary(description);
        book.setOneLiner(description != null && description.length() > 60 ? description.substring(0, 60) + "..." : description);
        book.setIsbn(isbn);
        if (book.getPrimaryTags() == null) {
            book.setPrimaryTags("#알라딘추천,#실시간도서");
        }
        if (book.getDerivativeTags() == null) {
            book.setDerivativeTags("#알라딘OpenAPI,#베스트셀러,#추천도서");
        }

        Book savedBook = bookRepository.save(book);

        return convertToDto(savedBook);
    }

    public BookResponseDto convertToDto(Book book) {
        if (book == null) return null;
        return BookResponseDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .publishedYear(book.getPublishedYear())
                .category(book.getCategory())
                .coverColor(book.getCoverColor())
                .cover(book.getCover())
                .oneLiner(book.getOneLiner())
                .summary(book.getSummary())
                .keyQuote(book.getKeyQuote() != null ? book.getKeyQuote() : book.getOneLiner())
                .primaryTags(parseTags(book.getPrimaryTags()))
                .derivativeTags(parseTags(book.getDerivativeTags()))
                .build();
    }

    private List<String> parseTags(String tagsStr) {
        if (tagsStr == null || tagsStr.isBlank()) return Collections.emptyList();
        return Arrays.stream(tagsStr.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private Map<String, Object> parseAladinJson(String raw) {
        if (raw == null || raw.isBlank()) return null;
        try {
            int start = raw.indexOf("{");
            int end = raw.lastIndexOf("}");
            if (start != -1 && end != -1 && end > start) {
                String jsonStr = raw.substring(start, end + 1);
                return objectMapper.readValue(jsonStr, Map.class);
            }
        } catch (Exception e) {
            System.err.println("알라딘 JSON 파싱 오류: " + e.getMessage());
        }
        return null;
    }
}
