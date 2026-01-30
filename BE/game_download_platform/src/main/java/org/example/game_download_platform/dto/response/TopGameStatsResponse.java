package org.example.game_download_platform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.game_download_platform.entity.Game;

@Getter
@AllArgsConstructor
public class TopGameStatsResponse {

    private Long id;
    private String title;
    private int viewCount;
    private int downloadCount;

    public static TopGameStatsResponse from(Game game) {
        return new TopGameStatsResponse(
                game.getId(),
                game.getTitle(),
                game.getViewCount(),
                game.getDownloadCount()
        );
    }

}
