package org.example.game_download_platform.repository;

import org.example.game_download_platform.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IVerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    VerificationToken findByToken(String token);
}
