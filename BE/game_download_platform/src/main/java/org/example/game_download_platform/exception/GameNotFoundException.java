package org.example.game_download_platform.exception;

public class GameNotFoundException extends RuntimeException {

    public GameNotFoundException(Long gameId) {
        super("Không tìm thấy game với id = " + gameId);
    }
}

