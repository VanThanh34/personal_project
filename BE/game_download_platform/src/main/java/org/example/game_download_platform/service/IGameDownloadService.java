package org.example.game_download_platform.service;

import org.example.game_download_platform.entity.User;

public interface IGameDownloadService {
    String downloadGame(Long gameId, Long userId);

}
