package org.example.game_download_platform.service;

import org.example.game_download_platform.dto.request.CreateGameRequest;
import org.example.game_download_platform.dto.request.UpdateGameRequest;
import org.example.game_download_platform.dto.response.GameResponse;
import org.example.game_download_platform.dto.response.AdminGameStatsResponse;
import org.example.game_download_platform.dto.response.TopGameStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IAdminGameService {

    // 1️⃣ ADMIN xem danh sách game (có phân trang)
    Page<GameResponse> getAll(Pageable pageable);

    // 2️⃣ ADMIN xem chi tiết 1 game
    GameResponse getById(Long id);

    // 3️⃣ ADMIN tạo game mới
    GameResponse create(CreateGameRequest request);

    // 4️⃣ ADMIN cập nhật game
    GameResponse update(Long id, UpdateGameRequest request);

    // 5️⃣ ADMIN xoá game (soft delete)
    void delete(Long id);
    // ADMIN  bật lại game
    void restore(Long id);

    // Thống kê Game
    Page<TopGameStatsResponse> getTopGamesByView(Pageable pageable);

    Page<TopGameStatsResponse> getTopGamesByDownload(Pageable pageable);

    Page<GameResponse> searchGames(
            String keyword,
            Long categoryId,
            Boolean enabled,
            Pageable pageable
    );


    long totalGames();

    long totalActiveGames();

    AdminGameStatsResponse getGameSummary();
}
