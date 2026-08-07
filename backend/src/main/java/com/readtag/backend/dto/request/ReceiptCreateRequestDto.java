package com.readtag.backend.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ReceiptCreateRequestDto {
    private Long bookId;
    private List<String> selectedTags;
    private String userName;
    private String quote;
    private String reviewText;
    private List<String> stickers;
}
