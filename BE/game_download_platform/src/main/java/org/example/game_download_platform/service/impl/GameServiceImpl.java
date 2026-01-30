package org.example.game_download_platform.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.GameResponse;
import org.example.game_download_platform.entity.Game;
import org.example.game_download_platform.exception.CategoryNotFoundException;
import org.example.game_download_platform.exception.GameDisabledException;
import org.example.game_download_platform.repository.ICategoryRepository;
import org.example.game_download_platform.repository.IGameRepository;
import org.example.game_download_platform.repository.specification.GameSpecification;
import org.example.game_download_platform.service.IGameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements IGameService {

    private final IGameRepository gameRepository;
    private final ICategoryRepository categoryRepository;

    @Override
    public Page<GameResponse> getAll(Pageable pageable) {
        return gameRepository.findByEnabledTrue(pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public GameResponse getDetail(Long id) {
        Game game = gameRepository
                .findByIdAndEnabledTrue(id)
                .orElseThrow(() ->
                        new GameDisabledException("Game đã bị gỡ")
                );

        game.setViewCount(game.getViewCount() + 1);

        return mapToResponse(game);
    }
    @Override
    public Page<GameResponse> searchGames(
            String keyword,
            Long categoryId,
            Pageable pageable
    ) {

        if (categoryId != null) {
            categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new CategoryNotFoundException(categoryId));
        }

        Specification<Game> spec =
                Specification.where(GameSpecification.isEnabled());

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and(GameSpecification.titleContains(keyword));
        }

        if (categoryId != null) {
            spec = spec.and(GameSpecification.hasCategory(categoryId));
        }

        Page<Game> page = gameRepository.findAll(spec, pageable);

        return page.map(GameResponse::from);
    }

    //  MAPPER
    private GameResponse mapToResponse(Game game) {
        return GameResponse.builder()
                .id(game.getId())
                .title(game.getTitle())
                .description(game.getDescription())
                .thumbnailUrl(game.getThumbnailUrl())
                .downloadUrl(game.getDownloadUrl())
                .fileSize(game.getFileSize())

                .categoryId(
                        game.getCategory() != null
                                ? game.getCategory().getId()
                                : null
                )
                .categoryName(
                        game.getCategory() != null
                                ? game.getCategory().getName()
                                : null
                )

                .viewCount( game.getViewCount())
                .downloadCount( game.getDownloadCount())
                .enabled(game.isEnabled())

                .createdAt(LocalDateTime.now())
                .build();
    }
}



