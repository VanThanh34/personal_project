package org.example.game_download_platform.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminGameStatsResponse {

    private long totalGames;
    private long activeGames;
    private long disabledGames;

    public AdminGameStatsResponse(long totalGames, long activeGames, long disabledGames) {
        this.totalGames = totalGames;
        this.activeGames = activeGames;
        this.disabledGames = disabledGames;
    }
}

