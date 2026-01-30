package org.example.game_download_platform.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class AdminUserResponse {

    private Long id;
    private String username;
    private String email;
    private boolean enabled;
    private Set<String> roles;
}

