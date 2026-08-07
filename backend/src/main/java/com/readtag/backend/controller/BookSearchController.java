package com.readtag.backend.controller;

import com.readtag.backend.dto.response.BookResponseDto;
import com.readtag.backend.service.AladinBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookSearchController {

    private final AladinBookService aladinBookService;

    /**
     * 알라딘 키워드 도서 검색 API
     * GET /api/v1/books/search?keyword=자바
     */
    @GetMapping("/search")
    public ResponseEntity<List<BookResponseDto>> searchBooks(@RequestParam(name = "keyword", required = false) String keyword) {
        List<BookResponseDto> books = aladinBookService.searchBooksKeyword(keyword);
        return ResponseEntity.ok(books);
    }

    /**
     * 알라딘 베스트셀러 목록 조회 API
     * GET /api/v1/books/bestsellers
     */
    @GetMapping("/bestsellers")
    public ResponseEntity<List<BookResponseDto>> getBestsellers() {
        List<BookResponseDto> bestsellers = aladinBookService.getBestsellers();
        return ResponseEntity.ok(bestsellers);
    }
}
