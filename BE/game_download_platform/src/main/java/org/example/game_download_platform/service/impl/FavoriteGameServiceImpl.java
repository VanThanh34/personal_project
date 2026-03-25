package org.example.game_download_platform.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.GameResponse;
import org.example.game_download_platform.entity.FavoriteGame;
import org.example.game_download_platform.entity.Game;
import org.example.game_download_platform.entity.User;
import org.example.game_download_platform.repository.IFavoriteGameRepository;
import org.example.game_download_platform.repository.IGameRepository;
import org.example.game_download_platform.repository.IUserRepository;
import org.example.game_download_platform.service.IFavoriteGameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavoriteGameServiceImpl implements IFavoriteGameService {

    private final IFavoriteGameRepository favoriteGameRepository;
    private final IUserRepository userRepository;
    private final IGameRepository gameRepository;

    @Override
    @Transactional
    public void toggleFavorite(Long userId, Long gameId) {
        Optional<FavoriteGame> existing = favoriteGameRepository.findByUserIdAndGameId(userId, gameId);
        if (existing.isPresent()) {
            favoriteGameRepository.delete(existing.get());
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Game game = gameRepository.findById(gameId)
                    .orElseThrow(() -> new RuntimeException("Game not found"));

            FavoriteGame favoriteGame = new FavoriteGame();
            favoriteGame.setUser(user);
            favoriteGame.setGame(game);
            favoriteGameRepository.save(favoriteGame);
        }
    }

    @Override
    public boolean checkFavorite(Long userId, Long gameId) {
        return favoriteGameRepository.existsByUserIdAndGameId(userId, gameId);
    }

    @Override
    public Page<GameResponse> getFavoriteGames(Long userId, Pageable pageable) {
        return favoriteGameRepository.findByUserId(userId, pageable)
                .map(fav -> GameResponse.from(fav.getGame()));
    }
}
