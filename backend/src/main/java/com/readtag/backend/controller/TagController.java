package com.readtag.backend.controller;

import com.readtag.backend.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tags")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TagController {

    private final TagService tagService;

    @GetMapping("/presets")
    public ResponseEntity<List<String>> getPresetTags() {
        List<String> tags = tagService.getPresetTags();
        return ResponseEntity.ok(tags);
    }
}
