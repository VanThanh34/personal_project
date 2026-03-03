package org.example.game_download_platform.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "download_tokens")
public class DownloadToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    private Long userId; // Ai là người tạo link này
    private Long gameId; // Link này tải game gì

    @Column(name = "is_used")
    private boolean used = false; // Đã dùng chưa?

    private LocalDateTime expiryTime; // Hạn sử dụng (ví dụ 1 tiếng)
}