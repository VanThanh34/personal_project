CREATE TABLE verification_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    expiry_date DATETIME NOT NULL,
    CONSTRAINT fk_verification_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
