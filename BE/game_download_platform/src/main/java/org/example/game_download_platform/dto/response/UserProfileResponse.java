package org.example.game_download_platform.dto.response;

import lombok.Builder;
import lombok.Getter;
import org.example.game_download_platform.entity.User;

import java.time.LocalDate;

@Getter
@Builder
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private LocalDate dob;
    private String avatar;

    public static UserProfileResponse from(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .dob(user.getDob())
                .avatar(user.getAvatar())
                .build();
    }
}
