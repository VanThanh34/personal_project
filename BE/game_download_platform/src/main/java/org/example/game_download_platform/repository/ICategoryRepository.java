package org.example.game_download_platform.repository;

import org.example.game_download_platform.dto.response.CategoryStatsResponse;
import org.example.game_download_platform.dto.response.TopCategoryResponse;
import org.example.game_download_platform.entity.Category;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ICategoryRepository extends JpaRepository<Category, Long> {
    @Query("""
    select new org.example.game_download_platform.dto.response.CategoryStatsResponse(
        c.id,
        c.name,
        count(g),
        sum(case when g.enabled = true then 1L else 0L end),
        sum(case when g.enabled = false then 1L else 0L end),
        cast(coalesce(sum(g.viewCount), 0) as long),
        cast(coalesce(sum(g.downloadCount), 0) as long)
    )
    from Category c
    left join Game g on g.category = c
    group by c.id, c.name
""")
    List<CategoryStatsResponse> getCategoryStatistics();

    @Query("""
    select new org.example.game_download_platform.dto.response.TopCategoryResponse(
        c.id,
        c.name,
        cast(coalesce(sum(g.viewCount), 0) as long),
        cast(coalesce(sum(g.downloadCount), 0) as long)
    )
    from Category c
    left join Game g on g.category = c
    group by c.id, c.name
    order by sum(g.viewCount) desc
""")
    List<TopCategoryResponse> findTopCategoryByView(Pageable pageable);
}
