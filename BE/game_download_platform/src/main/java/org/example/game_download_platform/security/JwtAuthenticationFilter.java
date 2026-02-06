package org.example.game_download_platform.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        // Lấy header Authorization
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7); // Cắt bỏ "Bearer "

                // Kiểm tra username trước
                username = jwtUtil.extractUsername(token);

                // Check xem user đã được authenticate chưa để tránh làm lại
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    // Kiểm tra tính hợp lệ của Token
                    if (jwtUtil.isValid(token)) {
                        var userDetails = userDetailsService.loadUserByUsername(username);

                        var authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities()
                        );

                        authToken.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );

                        // QUAN TRỌNG: Set User vào SecurityContext
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        System.out.println("✅ Auth Success for user: " + username);
                    } else {
                        System.out.println("❌ Token Valid Check Failed for: " + username);
                    }
                }
            }
        } catch (Exception e) {
            // Log lỗi để debug (ví dụ: Token hết hạn, sai chữ ký...)
            System.err.println("⚠️ JWT Filter Error: " + e.getMessage());
        }

        chain.doFilter(request, response);
    }
}