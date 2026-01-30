package org.example.game_download_platform.service;

import org.example.game_download_platform.dto.response.GameResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IGameService {

    Page<GameResponse> getAll(Pageable pageable);

    GameResponse getDetail(Long id);

    Page<GameResponse> searchGames(
            String keyword,
            Long categoryId,
            Pageable pageable
    );

}

