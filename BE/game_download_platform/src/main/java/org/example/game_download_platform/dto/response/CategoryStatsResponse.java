package org.example.game_download_platform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryStatsResponse {

    private Long categoryId;
    private String categoryName;

    private Long totalGames;
    private Long activeGames;
    private Long disabledGames;

    private Long totalViews;
    private Long totalDownloads;
}
