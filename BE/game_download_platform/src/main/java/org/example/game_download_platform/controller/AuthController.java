package org.example.game_download_platform.controller;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.AuthResponse;
import org.example.game_download_platform.dto.request.LoginRequest;
import org.example.game_download_platform.dto.request.RegisterRequest;
import org.example.game_download_platform.service.impl.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("Đăng kí thành công");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(new AuthResponse(token));
    }

//    @GetMapping("/me")
//    public String me(Authentication authentication) {
//        return authentication.getName();
//    }
//
//    @GetMapping("/user/test")
//    public String userTest(Authentication authentication) {
//        return "USER access OK";
//    }

}
