package org.example.game_download_platform.service;

import org.example.game_download_platform.dto.response.GameResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IFavoriteGameService {
    void toggleFavorite(Long userId, Long gameId);
    boolean checkFavorite(Long userId, Long gameId);
    Page<GameResponse> getFavoriteGames(Long userId, Pageable pageable);
}
