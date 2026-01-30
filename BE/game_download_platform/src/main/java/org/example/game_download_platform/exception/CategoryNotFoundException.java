package org.example.game_download_platform.exception;

public class CategoryNotFoundException extends RuntimeException {

    public CategoryNotFoundException(Long categoryId) {
        super("Thể loại không tồn tại (id = " + categoryId + ")");
    }
}

