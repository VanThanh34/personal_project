package org.example.game_download_platform.controller;

import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.DownloadHistoryResponse;
import org.example.game_download_platform.service.IGameDownloadService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
@RequestMapping("/downloads")
@RequiredArgsConstructor
public class DownloadGameController {

    private final IGameDownloadService gameDownloadService;

    @GetMapping("/history")
    public ResponseEntity<List<DownloadHistoryResponse>> getMyDownloadHistory(
             Principal principal // Đổi UserPrincipal thành Principal
    ) {
        // Kiểm tra null cho chắc (phòng hờ filter chưa set context)
        if (principal == null) {
            // Có thể throw exception hoặc return lỗi 401 tùy logic
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
                gameDownloadService.getMyDownloadHistory(principal.getName())
        );
    }

}
