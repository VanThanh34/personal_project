package org.example.game_download_platform.security;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.entity.User;
import org.example.game_download_platform.repository.IUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final IUserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Không tìm thấy ngưòi dùng: " + username)
                );

        return new CustomUserDetails(user);
    }
}
