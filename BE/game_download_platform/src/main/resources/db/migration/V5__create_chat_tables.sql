CREATE TABLE chat_rooms (
                            id BIGINT PRIMARY KEY AUTO_INCREMENT,
                            user_id BIGINT,
                            admin_id BIGINT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users(id),
                            FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE messages (
                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          chat_room_id BIGINT,
                          sender_id BIGINT,
                          content TEXT,
                          sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id),
                          FOREIGN KEY (sender_id) REFERENCES users(id)
);
