package org.example.game_download_platform.dto.request;

import lombok.Data;

@Data
public class UpdateGameRequest {

    private String title;

    private String description;

    private String thumbnailUrl;

    private String downloadUrl;

    private Long categoryId;

    private Double fileSize;

    private Boolean enabled; // bật / tắt game
}
