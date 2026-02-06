package org.example.game_download_platform.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.entity.DownloadToken;
import org.example.game_download_platform.entity.Game;
import org.example.game_download_platform.repository.IDownloadTokenRepository;
import org.example.game_download_platform.repository.IGameRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DownloadService {

    private final IDownloadTokenRepository tokenRepository;
    private final IGameRepository gameRepository;

    // 1. Tạo Token tải xuống (Valid trong 1 tiếng)
    public String generateDownloadToken(Long userId, Long gameId) {
        String token = UUID.randomUUID().toString(); // Tạo chuỗi ngẫu nhiên

        DownloadToken downloadToken = new DownloadToken();
        downloadToken.setToken(token);
        downloadToken.setUserId(userId);
        downloadToken.setGameId(gameId);
        downloadToken.setUsed(false);
        downloadToken.setExpiryTime(LocalDateTime.now().plusHours(1)); // Link sống 1 tiếng

        tokenRepository.save(downloadToken);

        return token;
    }

    // 2. Xử lý tải file và HỦY TOKEN ngay lập tức
    @Transactional
    public Resource downloadFile(String token) {
        // Tìm token trong DB
        DownloadToken downloadToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Link tải không tồn tại hoặc sai!"));

        // Check 1: Đã dùng chưa?
        if (downloadToken.isUsed()) {
            throw new RuntimeException("Link này đã được sử dụng rồi! Vui lòng lấy link mới.");
        }

        // Check 2: Hết hạn chưa?
        if (downloadToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Link tải đã hết hạn!");
        }

        // --- ĐỐT TOKEN (Đánh dấu đã dùng) ---
        downloadToken.setUsed(true);
        tokenRepository.save(downloadToken);
        // Sau dòng này, ai có token này cũng vô dụng

        // --- LẤY FILE THẬT RA ĐỂ TRẢ VỀ ---
        Game game = gameRepository.findById(downloadToken.getGameId())
                .orElseThrow(() -> new RuntimeException("Game không tồn tại"));

        try {
            // Giả sử ông lưu file trong folder "uploads" hoặc đường dẫn trong game.getDownloadUrl()
            // Ông cần sửa lại path này trỏ đúng vào chỗ ông lưu file thật trên máy
            Path filePath = Paths.get("uploads").resolve(game.getDownloadUrl()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File game không tìm thấy trên server!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Lỗi đường dẫn file: " + e.getMessage());
        }
    }
}