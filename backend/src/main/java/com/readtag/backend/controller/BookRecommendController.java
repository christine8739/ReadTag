package com.readtag.backend.controller;

import com.readtag.backend.dto.request.RecommendRequestDto;
import com.readtag.backend.dto.response.PrescriptionResponseDto;
import com.readtag.backend.service.BookRecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recommend")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookRecommendController {

    private final BookRecommendService bookRecommendService;

    @PostMapping
    public ResponseEntity<PrescriptionResponseDto> recommendBooks(@RequestBody RecommendRequestDto requestDto) {
        PrescriptionResponseDto response = bookRecommendService.recommend(requestDto);
        return ResponseEntity.ok(response);
    }
}
