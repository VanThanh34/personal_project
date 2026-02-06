package org.example.game_download_platform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DownloadHistoryResponse {

    private Long downloadId;
    private Long gameId;
    private String gameTitle;
    private String downloadUrl;
    private LocalDateTime downloadedAt;
}




