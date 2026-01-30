package org.example.game_download_platform.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.entity.Download;
import org.example.game_download_platform.entity.Game;
import org.example.game_download_platform.entity.User;
import org.example.game_download_platform.exception.DownloadLimitException;
import org.example.game_download_platform.exception.GameDisabledException;
import org.example.game_download_platform.repository.IDownloadRepository;
import org.example.game_download_platform.repository.IGameRepository;
import org.example.game_download_platform.repository.IUserRepository;
import org.example.game_download_platform.service.IGameDownloadService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GameDownloadServiceImpl implements IGameDownloadService {

    private final IGameRepository gameRepository;
    private final IUserRepository userRepository;
    private final IDownloadRepository downloadRepository;

    @Override
    @Transactional
    public String downloadGame(Long gameId, Long userId) {

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy game"));

        if (!game.isEnabled()) {
            throw new GameDisabledException("Game đã bị gỡ");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        downloadRepository
                .findTopByUserAndGameOrderByDownloadedAtDesc(user, game)
                .ifPresent(last -> {
                    if (last.getDownloadedAt()
                            .plusMinutes(10)
                            .isAfter(LocalDateTime.now())) {
                        throw new DownloadLimitException("Bạn chỉ có thể tải 1 lần trong 10 phút");
                    }
                });

        Download download = new Download();
        download.setUser(user);
        download.setGame(game);
        download.setDownloadedAt(LocalDateTime.now());
        downloadRepository.save(download);

        game.setDownloadCount(game.getDownloadCount() + 1);
        gameRepository.save(game);

        return game.getDownloadUrl();
    }

}


