package org.example.game_download_platform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TopCategoryResponse {
    private Long categoryId;
    private String categoryName;
    private Long totalView;
    private Long totalDownload;
}
