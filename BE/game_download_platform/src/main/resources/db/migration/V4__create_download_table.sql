CREATE TABLE downloads (
                           id BIGINT PRIMARY KEY AUTO_INCREMENT,
                           user_id BIGINT,
                           game_id BIGINT,
                           downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           FOREIGN KEY (user_id) REFERENCES users(id),
                           FOREIGN KEY (game_id) REFERENCES games(id)
);
