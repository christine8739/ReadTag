package com.readtag.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PrescriptionResponseDto {
    private BookResponseDto primaryBook;
    private List<BookResponseDto> secondaryBooks;
    private List<String> derivativeTags;
}
