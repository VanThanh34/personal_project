CREATE TABLE categories (
                            id BIGINT PRIMARY KEY AUTO_INCREMENT,
                            name VARCHAR(100) NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
                       id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       title VARCHAR(150) NOT NULL,
                       description TEXT,
                       thumbnail_url VARCHAR(255),
                       download_url VARCHAR(255) NOT NULL,
                       file_size BIGINT,
                       view_count INT DEFAULT 0,
                       download_count INT DEFAULT 0,
                       enabled BOOLEAN DEFAULT 1,
                       category_id BIGINT,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (category_id) REFERENCES categories(id)
);
