package com.readtag.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ReceiptResponseDto {
    private Long id;
    private String receiptNo;
    private LocalDateTime createdAt;
    private BookResponseDto book;
    private List<String> selectedTags;
    private String userName;
    private String quote;
    private String reviewText;
    private List<String> stickers;
}
