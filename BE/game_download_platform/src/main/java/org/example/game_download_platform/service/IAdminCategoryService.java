package org.example.game_download_platform.service;

import org.example.game_download_platform.dto.response.CategoryStatsResponse;
import org.example.game_download_platform.dto.response.TopCategoryResponse;

import java.util.List;

public interface IAdminCategoryService {
    List<CategoryStatsResponse> getCategoryStatistics();
    List<TopCategoryResponse> getTopCategoryByView(int limit);
}
