package org.example.game_download_platform.repository;

import org.example.game_download_platform.entity.FavoriteGame;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IFavoriteGameRepository extends JpaRepository<FavoriteGame, Long> {
    Optional<FavoriteGame> findByUserIdAndGameId(Long userId, Long gameId);
    boolean existsByUserIdAndGameId(Long userId, Long gameId);
    Page<FavoriteGame> findByUserId(Long userId, Pageable pageable);
}
