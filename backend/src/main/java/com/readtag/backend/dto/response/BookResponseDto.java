package com.readtag.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class BookResponseDto {
    private Long id;
    private String title;
    private String author;
    private String publisher;
    private String publishedYear;
    private String category;
    private String coverColor;
    private String cover; // 알라딘 커버 표지 이미지 URL
    private String oneLiner;
    private String summary;
    private String keyQuote;
    private List<String> primaryTags;
    private List<String> derivativeTags;
}
