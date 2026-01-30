package org.example.game_download_platform.controller;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.GameResponse;
import org.example.game_download_platform.dto.response.PagedResponse;
import org.example.game_download_platform.mapper.PageMapper;
import org.example.game_download_platform.security.CustomUserDetails;
import org.example.game_download_platform.service.IGameDownloadService;
import org.example.game_download_platform.service.IGameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
public class GameController {

    private final IGameService gameService;
    private final IGameDownloadService gameDownloadService;

    @GetMapping
    public ResponseEntity<PagedResponse<GameResponse>> getGames(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {


        Pageable pageable = PageRequest.of(page, size);

        Page<GameResponse> result = gameService.getAll(pageable);

        return ResponseEntity.ok(
                PageMapper.toPagedResponse(result)
        );
    }

    @GetMapping("/{id}")
    public GameResponse getDetail(@PathVariable Long id) {
        return gameService.getDetail(id);
    }


    @PostMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> download(
            @PathVariable Long id,
            Authentication authentication
    ) {
        CustomUserDetails user =
                (CustomUserDetails) authentication.getPrincipal();

        gameDownloadService.downloadGame(id, user.getId());

        return ResponseEntity.ok("Đã thêm lượt tải!");
    }

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
            "id"
    );

}

