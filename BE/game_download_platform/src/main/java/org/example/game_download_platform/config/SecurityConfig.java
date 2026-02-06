package org.example.game_download_platform.config;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.security.JwtAccessDeniedHandler;
import org.example.game_download_platform.security.JwtAuthenticationEntryPoint;
import org.example.game_download_platform.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final JwtAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable()) // Tắt CORS tạm thời để test cho dễ
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint) // Xử lý lỗi 401
                        .accessDeniedHandler(accessDeniedHandler)           // Xử lý lỗi 403
                )
                .authorizeHttpRequests(auth -> auth
                        // --- PUBLIC ENDPOINTS ---
                        .requestMatchers(HttpMethod.GET, "/games/**").permitAll()
                        .requestMatchers("/games/stats/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()

                        .requestMatchers("/ws/**").permitAll()
                        // --- MỞ QUYỀN CHO LINK TẢI FILE (Token lo bảo mật rồi) ---
                        .requestMatchers("/downloads/file").permitAll()

                        // PROTECTED ENDPOINTS
                        .requestMatchers("/downloads/generate/**").authenticated() // Tạo link phải login
                        .requestMatchers("/downloads/history").authenticated()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}