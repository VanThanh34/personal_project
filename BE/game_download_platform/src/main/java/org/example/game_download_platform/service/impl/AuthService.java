package org.example.game_download_platform.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.request.LoginRequest;
import org.example.game_download_platform.dto.request.RegisterRequest;
import org.example.game_download_platform.entity.Role;
import org.example.game_download_platform.entity.User;
import org.example.game_download_platform.repository.IRoleRepository;
import org.example.game_download_platform.repository.IUserRepository;
import org.example.game_download_platform.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;


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
        user.setEnabled(true);
        user.setRoles(Set.of(userRole));

        userRepository.save(user);
    }

    // --- ĐÃ SỬA LẠI HÀM LOGIN ĐỂ HẾT BÁO ĐỎ ---
    public String login(LoginRequest request) {
        // 1. Xác thực username/password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // 2. Lấy UserDetails từ kết quả xác thực (chứa đầy đủ quyền hạn)
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 3. Truyền UserDetails vào JwtUtil để tạo Token có chứa Roles
        return jwtUtil.generateToken(userDetails);
    }
}