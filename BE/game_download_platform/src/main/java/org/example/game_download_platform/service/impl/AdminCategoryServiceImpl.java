package org.example.game_download_platform.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.game_download_platform.dto.response.CategoryStatsResponse;
import org.example.game_download_platform.dto.response.TopCategoryResponse;
import org.example.game_download_platform.repository.ICategoryRepository;
import org.example.game_download_platform.service.IAdminCategoryService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminCategoryServiceImpl implements IAdminCategoryService {

    private final ICategoryRepository categoryRepository;

    @Override
    public List<CategoryStatsResponse> getCategoryStatistics() {
        return categoryRepository.getCategoryStatistics();
    }

    public List<TopCategoryResponse> getTopCategoryByView(int limit) {
        return categoryRepository
                .findTopCategoryByView(PageRequest.of(0, limit));
    }

}

