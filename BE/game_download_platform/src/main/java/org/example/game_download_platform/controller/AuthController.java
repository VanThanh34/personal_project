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
        System.out.println("Processing registration for: " + request.getUsername());
        try {
            authService.register(request);
            return ResponseEntity.ok("Đăng kí thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.");
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            throw e; // Let GlobalExceptionHandler handle it
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyAccount(@RequestParam("token") String token) {
        authService.verifyAccount(token);
        return ResponseEntity.ok("Tài khoản kích hoạt thành công!");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    // @GetMapping("/me")
    // public String me(Authentication authentication) {
    // return authentication.getName();
    // }
    //
    // @GetMapping("/user/test")
    // public String userTest(Authentication authentication) {
    // return "USER access OK";
    // }

}
