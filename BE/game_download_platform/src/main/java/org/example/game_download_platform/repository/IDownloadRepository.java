package org.example.game_download_platform.repository;

import org.example.game_download_platform.entity.Download;
import org.example.game_download_platform.entity.Game;
import org.example.game_download_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface IDownloadRepository extends JpaRepository<Download, Long> {


    Optional<Download> findTopByUserAndGameOrderByDownloadedAtDesc(
            User user,
            Game game
    );

    long countByGame(Game game);
}

