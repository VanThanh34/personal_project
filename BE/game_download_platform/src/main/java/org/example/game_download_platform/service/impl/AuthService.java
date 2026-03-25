package org.example.game_download_platform.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.request.LoginRequest;
import org.example.game_download_platform.dto.request.RegisterRequest;
import org.example.game_download_platform.entity.Role;
import org.example.game_download_platform.entity.User;
import org.example.game_download_platform.entity.VerificationToken;
import org.example.game_download_platform.repository.IRoleRepository;
import org.example.game_download_platform.repository.IUserRepository;
import org.example.game_download_platform.repository.IVerificationTokenRepository;
import org.example.game_download_platform.security.JwtUtil;
import org.example.game_download_platform.service.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final IVerificationTokenRepository tokenRepository;
    private final EmailService emailService;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên người dùng đã tồn tại");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        if (request.getDob() != null) {
            user.setDob(request.getDob());
        }
        user.setEnabled(false); // Chưa kích hoạt
        user.setRoles(Set.of(userRole));

        userRepository.save(user);

        // Tạo Token xác thực
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, user);
        tokenRepository.save(verificationToken);

        // Gửi Email
        emailService.sendVerificationEmail(user.getEmail(), token);
    }

    public void verifyAccount(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token);

        if (verificationToken == null) {
            throw new RuntimeException("Token không hợp lệ");
        }

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token đã hết hạn");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        // Xóa token sau khi dùng (Optionally)
        tokenRepository.delete(verificationToken);
    }

    // --- ĐÃ SỬA LẠI HÀM LOGIN ĐỂ HẾT BÁO ĐỎ ---
    public String login(LoginRequest request) {
        // 1. Xác thực username/password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        // 2. Lấy UserDetails từ kết quả xác thực (chứa đầy đủ quyền hạn)
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 3. Truyền UserDetails vào JwtUtil để tạo Token có chứa Roles
        return jwtUtil.generateToken(userDetails);
    }
}