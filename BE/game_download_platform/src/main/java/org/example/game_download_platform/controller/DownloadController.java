package org.example.game_download_platform.controller;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.service.IGameDownloadService; // Lưu ý import Interface
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.example.game_download_platform.entity.User;
import org.example.game_download_platform.repository.IUserRepository;

import java.net.URI;

@RestController
@RequestMapping("/downloads")
@RequiredArgsConstructor
public class DownloadController {

    private final IGameDownloadService downloadService; // Dùng Interface
    private final IUserRepository userRepository;

    @PostMapping("/generate/{gameId}")
    public ResponseEntity<String> generateLink(@PathVariable Long gameId,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String downloadLink = downloadService.generateDownloadLink(gameId, user.getId());
        return ResponseEntity.ok(downloadLink);
    }

    // --- API TẢI FILE (ĐÃ SỬA) ---
    @GetMapping("/file")
    public ResponseEntity<?> downloadFile(@RequestParam String token) {
        // Lấy kết quả (có thể là String hoặc Resource)
        Object result = downloadService.downloadFile(token);

        // CASE 1: Nếu là Link Online (String) -> Redirect
        if (result instanceof String) {
            String redirectUrl = (String) result;
            return ResponseEntity.status(HttpStatus.FOUND) // Mã 302 Found
                    .location(URI.create(redirectUrl))     // Chuyển hướng
                    .build();
        }

        // CASE 2: Nếu là File Local (Resource) -> Tải về
        if (result instanceof Resource) {
            Resource resource = (Resource) result;
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        }

        return ResponseEntity.badRequest().body("Lỗi không xác định");
    }
}