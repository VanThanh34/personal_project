-- ===== THÊM CATEGORY MỚI (NẾU CẦN) =====
INSERT INTO categories (id, name)
VALUES
    (4, 'Thể thao'),
    (5, 'Chiến thuật'),
    (6, 'Kinh dị')
ON DUPLICATE KEY UPDATE name = name;

-- ===== THÊM GAME MỚI =====
INSERT INTO games (
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
-- 1. Cyberpunk 2077 (Nhập vai - ID 2)
(
    'Cyberpunk 2077',
    'Game nhập vai hành động thế giới mở lấy bối cảnh tại Night City, một siêu đô thị bị ám ảnh bởi quyền lực, sự quyến rũ và sửa đổi cơ thể.',
    'https://cdn.europosters.eu/image/1300/102945.jpg',
    'https://drive.google.com/cyberpunk2077',
    75161927680, -- ~70GB
    0,
    0,
    1,
    2,
    NOW()
),
-- 2. The Witcher 3: Wild Hunt (Nhập vai - ID 2)
(
    'The Witcher 3: Wild Hunt',
    'Geralt of Rivia, thợ săn quái vật, trên hành trình tìm kiếm đứa con nuôi Ciri đang bị Wild Hunt truy đuổi.',
    'https://m.media-amazon.com/images/I/813JQra23oL._AC_UF894,1000_QL80_.jpg',
    'https://drive.google.com/witcher3',
    53687091200, -- ~50GB
    0,
    0,
    1,
    2,
    NOW()
),
-- 3. God of War (Hành động - ID 1)
(
    'God of War',
    'Kratos đã bỏ lại sự trả thù chống lại các vị thần Olympus, giờ đây sống trong vương quốc của các vị thần Bắc Âu.',
    'https://m.media-amazon.com/images/I/61LJWSvJGEL._AC_UF894,1000_QL80_.jpg',
    'https://drive.google.com/godofwar',
    75161927680, -- ~70GB
    0,
    0,
    1,
    1,
    NOW()
),
-- 4. Red Dead Redemption 2 (Hành động - ID 1)
(
    'Red Dead Redemption 2',
    'Câu chuyện sử thi về cuộc sống tại miền viễn tây nước Mỹ thời kỳ hiện đại bắt đầu.',
    'https://m.media-amazon.com/images/I/71PrNDWXLIL.jpg',
    'https://drive.google.com/rdr2',
    118111600640, -- ~110GB
    0,
    0,
    1,
    1,
    NOW()
),
-- 5. FIFA 23 (Thể thao - ID 4)
(
    'FIFA 23',
    'Trải nghiệm bóng đá chân thực nhất với HyperMotion2 Technology.',
    'https://m.media-amazon.com/images/M/MV5BODdjODAyMTAtMDlkYS00ZDE3LWI4MTQtZDc1ZjY1YzQ5MzU2XkEyXkFqcGc@._V1_.jpg',
    'https://drive.google.com/fifa23',
    48318382080, -- ~45GB
    0,
    0,
    1,
    4,
    NOW()
),
-- 6. Resident Evil Village (Kinh dị - ID 6)
(
    'Resident Evil Village',
    'Trải nghiệm kinh dị sống còn chưa từng có trong phần thứ 8 của loạt game Resident Evil.',
    'https://image.api.playstation.com/vulcan/ap/rnd/202101/0812/FkzwjnJknkrFlozkTdeQBMub.png',
    'https://drive.google.com/revillage',
    37580963840, -- ~35GB
    0,
    0,
    1,
    6,
    NOW()
),
-- 7. Civilization VI (Chiến thuật - ID 5)
(
    'Civilization VI',
    'Xây dựng đế chế, mở rộng lãnh thổ và chinh phục thế giới.',
    'https://i.ebayimg.com/images/g/xQEAAOSwtYtkcWSS/s-l1200.jpg',
    'https://drive.google.com/civ6',
    16106127360, -- ~15GB
    0,
    0,
    1,
    5,
    NOW()
),
-- 8. Hollow Knight (Phiêu lưu - ID 3)
(
    'Hollow Knight',
    'Khám phá vương quốc côn trùng bị lãng quên Hallownest trong game hành động phiêu lưu 2D tuyệt đẹp.',
    'https://preview.redd.it/wanted-to-buy-a-hollow-knight-poster-but-surprisingly-v0-ohro7c8y2hi81.jpg?width=640&crop=smart&auto=webp&s=b23167d834af778328d7842d1360a18e2d83ed64',
    'https://drive.google.com/hollowknight',
    4294967296, -- ~4GB
    0,
    0,
    1,
    3,
    NOW()
),
-- 9. Sekiro: Shadows Die Twice (Hành động - ID 1)
(
    'Sekiro: Shadows Die Twice',
    'Vào vai "Sói một tay", một chiến binh disgraced và disfigured được giải cứu khỏi bờ vực cái chết.',
    'https://i.ebayimg.com/images/g/6DgAAOSw3mxdeuwl/s-l1200.jpg',
    'https://drive.google.com/sekiro',
    26843545600, -- ~25GB
    0,
    0,
    1,
    1,
    NOW()
),
-- 10. Hades (Hành động - ID 1)
(
    'Hades',
    'Thách thức thần chết và chặt chém để thoát khỏi Địa ngục trong game roguelike dungeon crawler này.',
    'https://m.media-amazon.com/images/I/71FjVhf-SlL._AC_UF894,1000_QL80_.jpg',
    'https://drive.google.com/hades',
    21474836480, -- ~20GB
    0,
    0,
    1,
    1,
    NOW()
);
