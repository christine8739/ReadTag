package com.readtag.backend.config;

import com.readtag.backend.entity.Hashtag;
import com.readtag.backend.repository.BookRepository;
import com.readtag.backend.repository.HashtagRepository;
import com.readtag.backend.service.AladinBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final HashtagRepository hashtagRepository;
    private final AladinBookService aladinBookService;

    @Override
    public void run(String... args) {
        // 알라딘 API를 동적 호출하여 H2 데이터베이스(books 테이블)에 실시간 베스트셀러 도서 저장
        if (bookRepository.count() == 0) {
            try {
                aladinBookService.getBestsellers();
            } catch (Exception e) {
                System.err.println("초기 알라딘 API 도서 저장 실패: " + e.getMessage());
            }
        }

        if (hashtagRepository.count() == 0) {
            initHashtags();
        }
    }

    private void initHashtags() {
        List<String> emotions = List.of("#도파민", "#번아웃극복", "#위로가필요해", "#현타", "#성장통", "#고독한밤");
        List<String> genres = List.of("#세계문학전집", "#텍스트힙", "#커피와고전", "#철학한스푼", "#우주와사랑", "#인간관계론");
        List<String> goals = List.of("#오답노트", "#갓생살기", "#몰입의즐거움", "#미니멀라이프", "#리프레시", "#괴짜천재");

        for (String tag : emotions) {
            Hashtag h = new Hashtag();
            h.setName(tag);
            h.setCategory("emotion");
            hashtagRepository.save(h);
        }
        for (String tag : genres) {
            Hashtag h = new Hashtag();
            h.setName(tag);
            h.setCategory("genre");
            hashtagRepository.save(h);
        }
        for (String tag : goals) {
            Hashtag h = new Hashtag();
            h.setName(tag);
            h.setCategory("goal");
            hashtagRepository.save(h);
        }
    }
}
