package com.readtag.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    private String publisher;
    private String publishedYear;
    private String category;
    private String coverColor;

    @Column(length = 500)
    private String cover; // 알라딘 도서 커버 이미지 URL

    @Column(length = 1000)
    private String oneLiner;

    @Column(length = 2000)
    private String summary;

    @Column(length = 1000)
    private String keyQuote;

    @Column(length = 500)
    private String primaryTags;

    @Column(length = 500)
    private String derivativeTags;

    private String isbn;
}
