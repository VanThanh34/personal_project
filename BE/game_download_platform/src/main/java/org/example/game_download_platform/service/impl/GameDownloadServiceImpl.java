package org.example.game_download_platform.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.DownloadHistoryResponse;
import org.example.game_download_platform.entity.Download;
import org.example.game_download_platform.entity.DownloadToken;
import org.example.game_download_platform.entity.Game;
import org.example.game_download_platform.entity.User;
import org.example.game_download_platform.exception.DownloadLimitException;
import org.example.game_download_platform.exception.GameDisabledException;
import org.example.game_download_platform.repository.*;
import org.example.game_download_platform.service.IGameDownloadService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GameDownloadServiceImpl implements IGameDownloadService {

    private final IGameRepository gameRepository;
    private final IUserRepository userRepository;
    private final IDownloadRepository downloadRepository;
    private final IDownloadTokenRepository tokenRepository; // Repository Token ông đã tạo
    private final SimpMessagingTemplate messagingTemplate;

    // BƯỚC 1: KIỂM TRA & TẠO LINK
    @Override
    @Transactional
    public String generateDownloadLink(Long gameId, Long userId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy game"));

        if (!game.isEnabled()) {
            throw new GameDisabledException("Game đã bị gỡ");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Check giới hạn 10 phút
        downloadRepository
                .findTopByUserAndGameOrderByDownloadedAtDesc(user, game)
                .ifPresent(last -> {
                    if (last.getDownloadedAt().plusMinutes(10).isAfter(LocalDateTime.now())) {
                        throw new DownloadLimitException("Bạn chỉ có thể tải 1 lần trong 10 phút");
                    }
                });

        // Tạo Token dùng 1 lần
        String tokenStr = UUID.randomUUID().toString();
        DownloadToken token = new DownloadToken();
        token.setToken(tokenStr);
        token.setUserId(userId);
        token.setGameId(gameId);
        token.setUsed(false);
        token.setExpiryTime(LocalDateTime.now().plusHours(1)); // Hết hạn sau 1 giờ

        tokenRepository.save(token);

        // Trả về Link Full (Cấu hình cứng localhost hoặc lấy từ properties)
        return "http://localhost:8080/downloads/file?token=" + tokenStr;
    }

    // BƯỚC 2: XỬ LÝ TẢI FILE THẬT
    @Override
    @Transactional
    public Object downloadFile(String tokenStr) {
        // 1. Validate Token
        DownloadToken token = tokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new RuntimeException("Link tải không hợp lệ!"));

        if (token.isUsed()) throw new RuntimeException("Link đã được sử dụng!");
        if (token.getExpiryTime().isBefore(LocalDateTime.now())) throw new RuntimeException("Link đã hết hạn!");

        // 2. Đốt Token
        token.setUsed(true);
        tokenRepository.save(token);

        // 3. Lưu lịch sử & Tăng View
        Game game = gameRepository.findById(token.getGameId()).orElseThrow();
        User user = userRepository.findById(token.getUserId()).orElseThrow();

        Download download = new Download();
        download.setUser(user);
        download.setGame(game);
        download.setDownloadedAt(LocalDateTime.now());
        downloadRepository.save(download);

        game.setDownloadCount(game.getDownloadCount() + 1);
        gameRepository.save(game);
        messagingTemplate.convertAndSend("/topic/admin-update", "REFRESH_DASHBOARD");

        // 4. XỬ LÝ TRẢ VỀ (QUAN TRỌNG)
        String downloadUrl = game.getDownloadUrl();

        // TRƯỜNG HỢP A: Là Link Online (Google Drive, Fshare...)
        if (downloadUrl.startsWith("http://") || downloadUrl.startsWith("https://")) {
            return downloadUrl; // Trả về String để Controller biết mà Redirect
        }

        // TRƯỜNG HỢP B: Là File trên Server (Local)
        try {
            Path filePath = Paths.get("uploads").resolve(downloadUrl).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) return resource; // Trả về Resource để Controller stream file
            else throw new RuntimeException("File không tồn tại trên server!");
        } catch (MalformedURLException e) {
            throw new RuntimeException("Lỗi đường dẫn file");
        }
    }

    @Override
    public List<DownloadHistoryResponse> getMyDownloadHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        return downloadRepository.findDownloadHistoryByUserId(user.getId());
    }
}