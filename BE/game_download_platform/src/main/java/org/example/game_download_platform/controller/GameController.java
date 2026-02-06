package org.example.game_download_platform.controller;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.GameResponse;
import org.example.game_download_platform.dto.response.PagedResponse;
import org.example.game_download_platform.mapper.PageMapper;
import org.example.game_download_platform.service.IGameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
public class GameController {

    private final IGameService gameService;
    // Đã xóa IGameDownloadService vì logic tải game đã chuyển sang DownloadController

    // 1. Lấy danh sách game (Phân trang)
    @GetMapping
    public ResponseEntity<PagedResponse<GameResponse>> getGames(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<GameResponse> result = gameService.getAll(pageable);
        return ResponseEntity.ok(PageMapper.toPagedResponse(result));
    }

    // 2. Lấy chi tiết game
    @GetMapping("/{id}")
    public ResponseEntity<GameResponse> getGameById(@PathVariable Long id) {
        return ResponseEntity.ok(gameService.getDetail(id));
    }

    // 3. Tìm kiếm game
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<GameResponse>> searchGames(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort
    ) {

        Pageable pageable;

        if (sort != null && !sort.isBlank()) {
            String[] sortParams = sort.split(",");

            if (sortParams.length != 2) {
                throw new IllegalArgumentException("Tham số sort không hợp lệ. Ví dụ: viewCount,asc");
            }

            String sortField = sortParams[0];
            String sortDirection = sortParams[1];

            if (!ALLOWED_SORT_FIELDS.contains(sortField)) {
                throw new IllegalArgumentException(
                        "Không hỗ trợ sắp xếp theo: " + sortField
                );
            }

            pageable = PageRequest.of(
                    page,
                    size,
                    Sort.by(Sort.Direction.fromString(sortDirection), sortField)
            );
        } else {
            pageable = PageRequest.of(page, size);
        }

        Page<GameResponse> result =
                gameService.searchGames(keyword, categoryId, pageable);

        return ResponseEntity.ok(PageMapper.toPagedResponse(result));
    }

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "viewCount",
            "downloadCount",
            "title",
            "createdAt",
            "id"
    );

    // --- LƯU Ý QUAN TRỌNG ---
    // Đã XÓA hàm downloadGame ở đây.
    // Lý do: Frontend bây giờ gọi vào "/downloads/generate/{id}" (thuộc DownloadController)
    // chứ không gọi vào "/games/{id}/download" nữa.
}