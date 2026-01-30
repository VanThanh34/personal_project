package org.example.game_download_platform.exception;

public class DownloadLimitException extends RuntimeException {
    public DownloadLimitException(String message) {
        super(message);
    }
}
