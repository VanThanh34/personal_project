package org.example.game_download_platform.repository.specification;

import org.example.game_download_platform.entity.Game;
import org.springframework.data.jpa.domain.Specification;

public class GameSpecification {

    public static Specification<Game> isEnabled() {
        return (root, query, cb) ->
                cb.isTrue(root.get("enabled"));
    }

    public static Specification<Game> titleContains(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return null;
            }
            return cb.like(
                    cb.lower(root.get("title")),
                    "%" + keyword.trim().toLowerCase() + "%"
            );
        };
    }



    public static Specification<Game> hasCategory(Long categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) {
                return null;
            }
            return cb.equal(root.get("category").get("id"), categoryId);
        };
    }


    public static Specification<Game> hasEnabled(Boolean enabled) {
        return (root, query, cb) -> {
            if (enabled == null) {
                return null;
            }
            return cb.equal(root.get("enabled"), enabled);
        };
    }

}

