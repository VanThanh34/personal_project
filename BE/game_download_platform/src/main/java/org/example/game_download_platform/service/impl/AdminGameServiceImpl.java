package org.example.game_download_platform.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.request.CreateGameRequest;
import org.example.game_download_platform.dto.request.UpdateGameRequest;
import org.example.game_download_platform.dto.response.GameResponse;
import org.example.game_download_platform.dto.response.AdminGameStatsResponse;
import org.example.game_download_platform.dto.response.TopGameStatsResponse;
import org.example.game_download_platform.entity.Category;
import org.example.game_download_platform.entity.Game;
import org.example.game_download_platform.exception.CategoryNotFoundException;
import org.example.game_download_platform.exception.GameNotFoundException;
import org.example.game_download_platform.repository.ICategoryRepository;
import org.example.game_download_platform.repository.IGameRepository;
import org.example.game_download_platform.repository.specification.GameSpecification;
import org.example.game_download_platform.service.IAdminGameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminGameServiceImpl implements IAdminGameService {

    private final IGameRepository gameRepository;
    private final ICategoryRepository categoryRepository;
    // ADMIN xem tất cả game
    @Override
    public Page<GameResponse> getAll(Pageable pageable) {
        return gameRepository.findAll(pageable)
                .map(GameResponse::from);
    }

    // ADMIN xem chi tiết (kể cả disabled)
    @Override
    public GameResponse getById(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() ->
                        new GameNotFoundException(id)
                );
        return mapToResponse(game);
    }

    // ADMIN tạo game
    @Override
    public GameResponse create(CreateGameRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new CategoryNotFoundException(request.getCategoryId())
                );

        Game game = new Game();
        game.setTitle(request.getTitle());
        game.setDescription(request.getDescription());
        game.setDownloadUrl(request.getDownloadUrl());
        game.setThumbnailUrl(request.getThumbnailUrl());
        game.setFileSize(request.getFileSize());
        game.setEnabled(true);

        game.setCategory(category);

        Game savedGame = gameRepository.save(game);

        return GameResponse.from(savedGame);
    }


    // ADMIN cập nhật game
    @Override
    public GameResponse update(Long gameId, UpdateGameRequest request) {

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new GameNotFoundException(gameId));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new CategoryNotFoundException(request.getCategoryId())
                );

        game.setTitle(request.getTitle());
        game.setDescription(request.getDescription());
        game.setDownloadUrl(request.getDownloadUrl());
        game.setThumbnailUrl(request.getThumbnailUrl());
        game.setFileSize(request.getFileSize());

        game.setCategory(category);

        Game updatedGame = gameRepository.save(game);

        return GameResponse.from(updatedGame);
    }


    // ADMIN xoá mềm game
    @Override
    public void delete(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new GameNotFoundException(id));

        game.setEnabled(false); // ✅ SOFT DELETE
    }

    // ADMIN bật lại game
    @Override
    public void restore(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new GameNotFoundException(id));

        if (game.isEnabled()) {
            throw new RuntimeException("Game đang hoạt động, không cần restore");
        }

        game.setEnabled(true);
    }

    @Override
    public Page<TopGameStatsResponse> getTopGamesByDownload(Pageable pageable) {

        Page<Game> page = gameRepository
                .findByEnabledTrueOrderByDownloadCountDesc(pageable);

        return page.map(TopGameStatsResponse::from);
    }

    @Override
    public Page<TopGameStatsResponse> getTopGamesByView(Pageable pageable) {

        Page<Game> page = gameRepository
                .findByEnabledTrueOrderByViewCountDesc(pageable);

        return page.map(TopGameStatsResponse::from);
    }

    @Override
    public Page<GameResponse> searchGames(
            String keyword,
            Long categoryId,
            Boolean enabled,
            Pageable pageable
    ) {
        Specification<Game> spec = Specification
                .where(GameSpecification.titleContains(keyword))
                .and(GameSpecification.hasCategory(categoryId))
                .and(GameSpecification.hasEnabled(enabled));

        Page<Game> page = gameRepository.findAll(spec, pageable);

        return page.map(GameResponse::from);
    }

    @Override
    public long totalGames() {
        return gameRepository.count();
    }

    @Override
    public long totalActiveGames() {
        return gameRepository.countByEnabledTrue();
    }

    private AdminGameStatsResponse mapToStats(Game game) {
        return AdminGameStatsResponse.builder()
                .totalGames(gameRepository.count())
                .activeGames(gameRepository.countByEnabledTrue())
                .disabledGames(gameRepository.countByEnabledFalse())
                .build();

    }
    public AdminGameStatsResponse getGameSummary() {

        long totalGames = gameRepository.count();
        long activeGames = gameRepository.countByEnabledTrue();
        long disabledGames = gameRepository.countByEnabledFalse();

        return new AdminGameStatsResponse(
                totalGames,
                activeGames,
                disabledGames
        );
    }

    // Mapper Entity → DTO
    private GameResponse mapToResponse(Game game) {
        return GameResponse.builder()
                .id(game.getId())
                .title(game.getTitle())
                .description(game.getDescription())
                .thumbnailUrl(game.getThumbnailUrl())
                .downloadUrl(game.getDownloadUrl())
                .viewCount( game.getViewCount())
                .downloadCount(game.getDownloadCount())
                .enabled(game.isEnabled())
                .build();
    }
}
