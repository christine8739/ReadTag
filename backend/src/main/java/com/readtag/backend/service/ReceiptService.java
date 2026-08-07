package com.readtag.backend.service;

import com.readtag.backend.dto.request.ReceiptCreateRequestDto;
import com.readtag.backend.dto.response.ReceiptResponseDto;
import com.readtag.backend.entity.Book;
import com.readtag.backend.entity.Receipt;
import com.readtag.backend.entity.Review;
import com.readtag.backend.repository.BookRepository;
import com.readtag.backend.repository.ReceiptRepository;
import com.readtag.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;
    private final AladinBookService aladinBookService;

    @Transactional
    public ReceiptResponseDto createReceipt(ReceiptCreateRequestDto requestDto) {
        Book book = null;
        if (requestDto.getBookId() != null) {
            book = bookRepository.findById(requestDto.getBookId()).orElse(null);
        }
        // DB에 저장되어 있는 가장 최근의 알라딘 API 도서 연결
        if (book == null && !bookRepository.findAll().isEmpty()) {
            List<Book> all = bookRepository.findAll();
            book = all.get(all.size() - 1);
        }

        Receipt receipt = new Receipt();
        receipt.setReceiptNo("RT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        receipt.setCreatedAt(LocalDateTime.now());
        receipt.setBook(book);
        if (requestDto.getSelectedTags() != null) {
            receipt.setSelectedTags(String.join(",", requestDto.getSelectedTags()));
        }

        Receipt savedReceipt = receiptRepository.save(receipt);

        Review review = new Review();
        review.setUserName(requestDto.getUserName() != null ? requestDto.getUserName() : "독서가 수영");
        review.setQuote(requestDto.getQuote());
        review.setReviewText(requestDto.getReviewText());
        if (requestDto.getStickers() != null) {
            review.setStickers(String.join(",", requestDto.getStickers()));
        }
        review.setReceipt(savedReceipt);
        reviewRepository.save(review);
        savedReceipt.setReview(review);

        return toDto(savedReceipt);
    }

    @Transactional(readOnly = true)
    public List<ReceiptResponseDto> getMyReceipts() {
        return receiptRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReceipt(Long id) {
        receiptRepository.deleteById(id);
    }

    private ReceiptResponseDto toDto(Receipt receipt) {
        Review review = receipt.getReview();
        List<String> stickers = Collections.emptyList();
        if (review != null && review.getStickers() != null && !review.getStickers().isBlank()) {
            stickers = Arrays.stream(review.getStickers().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
        }

        List<String> selectedTags = Collections.emptyList();
        if (receipt.getSelectedTags() != null && !receipt.getSelectedTags().isBlank()) {
            selectedTags = Arrays.stream(receipt.getSelectedTags().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
        }

        return ReceiptResponseDto.builder()
                .id(receipt.getId())
                .receiptNo(receipt.getReceiptNo())
                .createdAt(receipt.getCreatedAt())
                .book(aladinBookService.convertToDto(receipt.getBook()))
                .selectedTags(selectedTags)
                .userName(review != null ? review.getUserName() : "독서가")
                .quote(review != null ? review.getQuote() : "")
                .reviewText(review != null ? review.getReviewText() : "")
                .stickers(stickers)
                .build();
    }
}
