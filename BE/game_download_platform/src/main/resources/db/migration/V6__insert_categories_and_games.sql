-- ===== CATEGORY =====
INSERT INTO categories (id, name)
VALUES
    (1, 'Hành động'),
    (2, 'Nhập vai'),
    (3, 'Phiêu lưu')
    ON DUPLICATE KEY UPDATE name = name;

-- ===== GAME =====
INSERT INTO games (
    id,
    title,
    description,
    thumbnail_url,
    download_url,
    file_size,
    view_count,
    download_count,
    enabled,
    category_id,
    created_at
) VALUES
      (
          1,
          'GTA V',
          'Game thế giới mở hành động nổi tiếng',
          'https://mpk732t12016clusterb.wordpress.com/wp-content/uploads/2016/05/gta-5.jpg',
          'https://drive.google.com/gta5',
          53687091200,
          0,
          0,
          1,
          1,
          NOW()
      ),
      (
          2,
          'Elden Ring',
          'Game nhập vai hành động độ khó cao',
          'https://wallpapers.com/images/thumbnail/elden-ring-poster-6r85th0gnhifsqd0.jpg',
          'https://drive.google.com/elden',
          63687091200,
          0,
          0,
          1,
          2,
          NOW()
      )
    ON DUPLICATE KEY UPDATE title = title;
