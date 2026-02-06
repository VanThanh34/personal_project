package org.example.game_download_platform.service;

import org.example.game_download_platform.dto.response.DownloadHistoryResponse;
import org.springframework.core.io.Resource;
import java.util.List;

public interface IGameDownloadService {
    // 1. Hàm tạo link (trả về URL string chứa token)
    String generateDownloadLink(Long gameId, Long userId);

    // 2. Hàm tải file thật (trả về Resource file)
    Object downloadFile(String token);

    List<DownloadHistoryResponse> getMyDownloadHistory(String username);
}