package org.example.game_download_platform.mapper;

import org.example.game_download_platform.dto.response.PagedResponse;
import org.springframework.data.domain.Page;

public class PageMapper {

    public static <T> PagedResponse<T> toPagedResponse(Page<T> page) {

        PagedResponse<T> response = new PagedResponse<>();
        response.setContent(page.getContent());
        response.setPage(page.getNumber());
        response.setSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLast(page.isLast());

        return response;
    }
}

