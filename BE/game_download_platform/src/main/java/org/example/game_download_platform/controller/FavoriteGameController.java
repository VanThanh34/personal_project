package org.example.game_download_platform.controller;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.GameResponse;
import org.example.game_download_platform.security.CustomUserDetails;
import org.example.game_download_platform.service.IFavoriteGameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user/favorites")
@RequiredArgsConstructor
public class FavoriteGameController {

    private final IFavoriteGameService favoriteGameService;

    @GetMapping
    public ResponseEntity<Page<GameResponse>> getMyFavorites(@AuthenticationPrincipal CustomUserDetails userDetails, Pageable pageable) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(favoriteGameService.getFavoriteGames(userDetails.getId(), pageable));
    }

    @PostMapping("/{gameId}")
    public ResponseEntity<Map<String, String>> toggleFavorite(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long gameId) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        favoriteGameService.toggleFavorite(userDetails.getId(), gameId);
        return ResponseEntity.ok(Map.of("message", "Toggle success"));
    }

    @GetMapping("/check/{gameId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long gameId) {
        if (userDetails == null) {
            return ResponseEntity.ok(Map.of("isFavorited", false));
        }
        boolean isFavorited = favoriteGameService.checkFavorite(userDetails.getId(), gameId);
        return ResponseEntity.ok(Map.of("isFavorited", isFavorited));
    }
}
