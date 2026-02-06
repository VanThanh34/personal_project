CREATE TABLE download_tokens (
                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 token VARCHAR(255) NOT NULL,
                                 user_id BIGINT NOT NULL,
                                 game_id BIGINT NOT NULL,
                                 is_used BIT(1) NOT NULL DEFAULT 0,
                                 expiry_time DATETIME(6) NOT NULL,
                                 CONSTRAINT uk_token UNIQUE (token)
);