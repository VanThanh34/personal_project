package org.example.game_download_platform.controller;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.request.UpdateProfileRequest;
import org.example.game_download_platform.dto.response.UserProfileResponse;
import org.example.game_download_platform.entity.User;
import org.example.game_download_platform.repository.IUserRepository;
import org.example.game_download_platform.security.CustomUserDetails;
import org.example.game_download_platform.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Map;

@RestController
@RequestMapping("/user/profile")
@RequiredArgsConstructor
public class UserController {

    private final IUserRepository userRepository;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(UserProfileResponse.from(user));
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {

        if (userDetails == null) return ResponseEntity.status(401).build();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getDob() != null) user.setDob(request.getDob());

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(UserProfileResponse.from(savedUser));
    }

    @PostMapping("/avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("file") MultipartFile file) {

        if (userDetails == null) return ResponseEntity.status(401).build();

        String fileName = fileStorageService.storeFile(file);
        
        // Generate the URL for the avatar file
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/files/avatars/")
                .path(fileName)
                .toUriString();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAvatar(fileDownloadUri);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Avatar updated successfully",
                "avatarUrl", fileDownloadUri
        ));
    }
}
