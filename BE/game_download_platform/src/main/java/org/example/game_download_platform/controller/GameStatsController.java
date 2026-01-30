package org.example.game_download_platform.controller;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.GameResponse;
import org.example.game_download_platform.dto.response.TopGameStatsResponse;
import org.example.game_download_platform.service.IAdminGameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/games/stats")
@RequiredArgsConstructor
public class GameStatsController {

    private final IAdminGameService adminGameService;

    //  Game tải nhiều nhất (PUBLIC)
    @GetMapping("/top-download")
    public Page<TopGameStatsResponse> topDownload(Pageable pageable) {
        return adminGameService.getTopGamesByDownload(pageable);
    }

    //  Game xem nhiều nhất (PUBLIC)
    @GetMapping("/top-view")
    public Page<TopGameStatsResponse> topView(Pageable pageable) {
        return adminGameService.getTopGamesByView(pageable);
    }
}

