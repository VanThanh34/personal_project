package org.example.game_download_platform.controller;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.entity.Game;
import org.example.game_download_platform.entity.User;
import org.example.game_download_platform.repository.ICategoryRepository;
import org.example.game_download_platform.repository.IGameRepository;
import org.example.game_download_platform.repository.IUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN')") // Chỉ Admin mới vào được
public class AdminController {

    private final IGameRepository gameRepository;
    private final IUserRepository userRepository;
    private final ICategoryRepository categoryRepository;

    // 1. Dashboard Stats (Thống kê)
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalGames", gameRepository.count());
        stats.put("totalUsers", userRepository.count());
        // Tính tổng lượt tải (giả sử dùng Java Stream hoặc Query)
        stats.put("totalDownloads", gameRepository.findAll().stream().mapToInt(Game::getDownloadCount).sum());
        stats.put("totalViews", gameRepository.findAll().stream().mapToInt(Game::getViewCount).sum());
        return ResponseEntity.ok(stats);
    }


}