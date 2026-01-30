package org.example.game_download_platform.controller;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.request.CreateGameRequest;
import org.example.game_download_platform.dto.request.UpdateGameRequest;
import org.example.game_download_platform.dto.response.GameResponse;
import org.example.game_download_platform.dto.response.AdminGameStatsResponse;
import org.example.game_download_platform.dto.response.TopGameStatsResponse;
import org.example.game_download_platform.service.IAdminGameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/games")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminGameController {

    private final IAdminGameService adminGameService;

    // ADMIN xem danh sách game
    @GetMapping
    public Page<GameResponse> getAll(Pageable pageable) {
        return adminGameService.getAll(pageable);
    }

    // ADMIN xem chi tiết game
    @GetMapping("/{id}")
    public GameResponse getById(@PathVariable Long id) {
        return adminGameService.getById(id);
    }

    // ADMIN tạo game
    @PostMapping
    public GameResponse create(@RequestBody CreateGameRequest request) {
        return adminGameService.create(request);
    }

    // ADMIN cập nhật game
    @PutMapping("/{id}")
    public GameResponse update(
            @PathVariable Long id,
            @RequestBody UpdateGameRequest request
    ) {
        return adminGameService.update(id, request);
    }

    // ADMIN xoá mềm game
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        adminGameService.delete(id);
    }

    // ADMIN bật lại game
    @PutMapping("/{id}/restore")
    public ResponseEntity<?> restore(@PathVariable Long id) {
        adminGameService.restore(id);
        return ResponseEntity.ok("Khôi phục game thành công");
    }

    @GetMapping("/search")
    public Page<GameResponse> searchGames(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean enabled,
            Pageable pageable
    ) {
        return adminGameService.searchGames(
                keyword,
                categoryId,
                enabled,
                pageable
        );
    }

    // Thống kê
    @GetMapping("/stats/top-view")
    public Page<TopGameStatsResponse> getTopView(Pageable pageable) {
        return adminGameService.getTopGamesByView(pageable);
    }

    @GetMapping("/stats/top-download")
    public Page<TopGameStatsResponse> getTopDownload(Pageable pageable) {
        return adminGameService.getTopGamesByDownload(pageable);
    }

    @GetMapping("/stats/summary")
    public ResponseEntity<AdminGameStatsResponse> getGameSummary() {
        return ResponseEntity.ok(adminGameService.getGameSummary());
    }
}
