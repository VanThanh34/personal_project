🎮 Game Download Platform – Backend



Backend cho nền tảng tải game, quản lý game – category – user – thống kê, xây dựng bằng Spring Boot theo hướng REST API, phục vụ cho frontend sau này (React).



🚀 Mục tiêu dự án



Xây dựng backend hoàn chỉnh cho website tải game



Phân quyền Admin / User



Hỗ trợ tìm kiếm, lọc, phân trang



Cung cấp API thống kê phục vụ dashboard admin



Thiết kế theo hướng mở rộng dễ dàng cho giai đoạn sau



🛠 Công nghệ sử dụng



Java 17



Spring Boot



Spring Security + JWT



Spring Data JPA



Specification API



MySQL



Flyway (quản lý migration)



Postman (test API)



📁 Cấu trúc chính

src/main/java/org/example/game\_download\_platform

│

├── config          # Security, JWT config

├── controller      # REST Controllers (Admin / User)

├── service

│   ├── impl        # Business logic

│   └── interface

├── repository

│   ├── specification

│   └── JpaRepository

├── dto

│   ├── request

│   └── response

├── entity

├── exception

└── mapper



🔐 Xác thực \& phân quyền



Đăng ký / đăng nhập bằng JWT



Phân quyền:



USER: xem game, tìm kiếm, thống kê public



ADMIN: CRUD game, category, xem thống kê nâng cao



Toàn bộ API admin được bảo vệ bằng role ADMIN



🎯 Các chức năng đã hoàn thành

👤 Auth



Đăng ký



Đăng nhập



JWT Authorization



🎮 Game (Admin)



Tạo game mới



Cập nhật game



Bật / tắt game



Xoá game



Phân trang + sort



Gán game vào category



🔍 Game Search (Specification)



Tìm theo:



keyword (title)



categoryId



enabled



Kết hợp nhiều điều kiện



Phân trang + sort



Không lỗi khi param = null



📊 Statistics – Game (Admin)



Tổng số game



Game đang hoạt động



Game bị disable



Top game:



Theo view



Theo download



DTO tối ưu riêng cho dashboard (không dư dữ liệu)



🗂 Statistics – Category (Admin)



Tổng game theo category



Game active / disabled theo category



Tổng view / download theo category



JPQL select new DTO tối ưu, không load entity dư



🧪 Test API



Test bằng Postman



Có đầy đủ:



Auth (Bearer Token)



Admin APIs



Search APIs



Statistics APIs



🗄 Database



Quản lý bằng Flyway



Các migration chính:



User / Role



Category



Game



Download



Dữ liệu mẫu để test thống kê



🧠 Điểm mạnh của backend hiện tại



Logic rõ ràng, tách layer chuẩn



Specification linh hoạt



DTO riêng cho từng use-case



Query tối ưu (JPQL, aggregate)



Dễ mở rộng sang:



React frontend



Caching



Cloud storage



Recommendation



🛣 Hướng phát triển tiếp theo



Top Category (ranking)



Download history chi tiết



Thống kê theo thời gian



Frontend React



Redis cache



Deploy (Docker / Cloud)



👨‍💻 Tác giả



Văn Thành



Backend Developer (Java / Spring)

