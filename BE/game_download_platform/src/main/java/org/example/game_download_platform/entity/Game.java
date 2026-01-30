package org.example.game_download_platform.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "games")
@Getter
@Setter
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String title;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "download_url", nullable = false)
    private String downloadUrl;

    @Column(name = "file_size")
    private Double fileSize;

    @Column(name = "view_count")
    private int viewCount;

    @Column(name = "download_count")
    private int downloadCount;

    @Column(nullable = false)
    private boolean enabled;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;


}

