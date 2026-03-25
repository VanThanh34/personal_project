package org.example.game_download_platform.dto.request;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class UpdateProfileRequest {
    private String fullName;
    private LocalDate dob;
}
