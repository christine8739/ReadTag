package com.readtag.backend.service;

import com.readtag.backend.entity.Hashtag;
import com.readtag.backend.repository.HashtagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final HashtagRepository hashtagRepository;

    public List<String> getPresetTags() {
        List<Hashtag> tags = hashtagRepository.findAll();
        if (tags.isEmpty()) {
            return List.of("#도파민", "#세계문학전집", "#텍스트힙", "#오답노트", "#갓생살기", "#번아웃극복");
        }
        return tags.stream()
                .map(Hashtag::getName)
                .collect(Collectors.toList());
    }
}
