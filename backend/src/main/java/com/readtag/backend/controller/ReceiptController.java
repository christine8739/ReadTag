package com.readtag.backend.controller;

import com.readtag.backend.dto.request.ReceiptCreateRequestDto;
import com.readtag.backend.dto.response.ReceiptResponseDto;
import com.readtag.backend.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/receipts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReceiptController {

    private final ReceiptService receiptService;

    @PostMapping
    public ResponseEntity<ReceiptResponseDto> createReceipt(@RequestBody ReceiptCreateRequestDto requestDto) {
        ReceiptResponseDto response = receiptService.createReceipt(requestDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ReceiptResponseDto>> getMyReceipts() {
        List<ReceiptResponseDto> response = receiptService.getMyReceipts();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long id) {
        receiptService.deleteReceipt(id);
        return ResponseEntity.noContent().build();
    }
}
