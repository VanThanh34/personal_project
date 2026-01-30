package org.example.game_download_platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DownloadLimitException.class)
    public ResponseEntity<?> handleDownloadLimit(DownloadLimitException ex) {
        return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS) // 429
                .body(Map.of(
                        "error", "TOO_MANY_REQUESTS",
                        "message", ex.getMessage(),
                        "status", 429,
                        "timestamp", LocalDateTime.now()
                ));
    }


    @ExceptionHandler(GameDisabledException.class)
    public ResponseEntity<?> handleGameDisabled(GameDisabledException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "GAME_DISABLED",
                        "message", ex.getMessage(),
                        "status", 403,
                        "timestamp", LocalDateTime.now()
                ));
    }

    @ExceptionHandler(GameNotFoundException.class)
    public ResponseEntity<?> handleGameNotFound(GameNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "error", "GAME_NOT_FOUND",
                        "message", ex.getMessage(),
                        "status", 404,
                        "timestamp", LocalDateTime.now()
                ));
    }
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<?> handleCategoryNotFound(CategoryNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "error", "CATEGORY_NOT_FOUND",
                        "message", ex.getMessage(),
                        "status", 404,
                        "timestamp", LocalDateTime.now()
                ));
    }

}
