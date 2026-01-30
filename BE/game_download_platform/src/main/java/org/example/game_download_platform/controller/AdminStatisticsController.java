package org.example.game_download_platform.controller;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.TopCategoryResponse;
import org.example.game_download_platform.entity.Game;
import org.example.game_download_platform.repository.IGameRepository;
import org.example.game_download_platform.service.IAdminCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/categories/stats")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminStatisticsController {


    private final IAdminCategoryService adminCategoryService;

    @GetMapping
    public ResponseEntity<?> getCategoryStats() {
        return ResponseEntity.ok(adminCategoryService.getCategoryStatistics());
    }

    @GetMapping("/top-view")
    public List<TopCategoryResponse> topCategoryByView(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return adminCategoryService.getTopCategoryByView(limit);
    }
}

