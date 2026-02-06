package org.example.game_download_platform.repository;

import org.example.game_download_platform.entity.DownloadToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface IDownloadTokenRepository extends JpaRepository<DownloadToken, Long> {
    Optional<DownloadToken> findByToken(String token);
}