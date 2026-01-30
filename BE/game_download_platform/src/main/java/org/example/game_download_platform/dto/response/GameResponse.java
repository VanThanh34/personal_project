package org.example.game_download_platform.dto.response;

import lombok.Builder;
import lombok.Data;
import org.example.game_download_platform.entity.Game;

import java.time.LocalDateTime;

@Data
@Builder
public class GameResponse {

    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String downloadUrl;

    private Double fileSize;

    private Long categoryId;
    private String categoryName;

    private int viewCount;
    private int downloadCount;

    private boolean enabled;
    private LocalDateTime createdAt;



    public static GameResponse from(Game game) {

        return GameResponse.builder()
                .id(game.getId())
                .title(game.getTitle())
                .description(game.getDescription())
                .thumbnailUrl(game.getThumbnailUrl())
                .downloadUrl(game.getDownloadUrl())
                .fileSize(game.getFileSize())
                .viewCount(game.getViewCount())
                .downloadCount(game.getDownloadCount())
                .enabled(game.isEnabled())

                // ✅ CATEGORY
                .categoryId(
                        game.getCategory() != null ? game.getCategory().getId() : null
                )
                .categoryName(
                        game.getCategory() != null ? game.getCategory().getName() : null
                )


                .createdAt(LocalDateTime.now())

                .build();
    }



}
