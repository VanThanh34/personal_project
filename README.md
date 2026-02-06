🎮 Game Download PlatformMột hệ thống phân phối game trực tuyến Full-stack hiệu năng cao, bảo mật và cập nhật theo thời gian thực.Dự án cung cấp giải pháp toàn diện cho việc quản lý, tìm kiếm và tải xuống trò chơi với cơ chế bảo vệ link tải (Anti-leeching) và Dashboard quản trị trực quan.
🛠 Công Nghệ Sử Dụng (Tech Stack)
Backend: Spring Security (JWT), Spring Data JPA (Specification), WebSocket (STOMP), Flyway.
Frontend: Axios Interceptor, React Router, SockJS (Real-time).
Database: Thiết kế tối ưu quan hệ, Quản lý version bằng Flyway.
Tools: Postman, IntelliJ IDEA, VS Code.
🚀 Tính Năng Nổi Bật (Key Features)
1. 🛡️ Cơ Chế Tải Xuống Bảo Mật (Secure One-time Token)
Anti-leeching: Sử dụng Token dùng 1 lần (One-time use) để ngăn chặn việc chia sẻ link tải trái phép.

Rate Limiting: Giới hạn tần suất tải (ví dụ: 10 phút/lần) để chống spam.

Smart Delivery: Hỗ trợ cả file lưu trữ cục bộ (Local Storage) và chuyển hướng bảo mật (Redirect) cho Cloud Storage (Google Drive, Fshare...).

2. ⚡ Dashboard Admin Real-time
WebSocket Integration: Tích hợp STOMP/SockJS để cập nhật số liệu (Lượt xem, Lượt tải) ngay lập tức mà không cần reload trang.

Statistics: Thống kê trực quan về hiệu suất game, người dùng và danh mục.

3. 🔍 Tìm Kiếm & Phân Loại Nâng Cao
Sử dụng Spring Data JPA Specification để xây dựng bộ lọc động (Dynamic Filtering).

Hỗ trợ tìm kiếm kết hợp nhiều điều kiện: Từ khóa, Danh mục, Trạng thái, Sắp xếp (Sort & Pagination).

4. 🔐 Phân Quyền & Bảo Mật (RBAC)
JWT Authentication: Cơ chế đăng nhập không trạng thái (Stateless).

Phân quyền chặt chẽ:

User: Xem game, tìm kiếm, tải game (có bảo mật), xem lịch sử tải.

Admin: CRUD Game/User/Category, xem Dashboard thống kê, quản lý file.

📁 Cấu Trúc Dự Án
Hệ thống được tổ chức theo kiến trúc Layered Architecture chuẩn:

project-root
├── backend (Spring Boot)
│   ├── config          # Security, WebSocket, JWT configuration
│   ├── controller      # REST APIs (Admin/User/Download)
│   ├── service         # Business Logic (Secure Token, Async tasks)
│   ├── repository      # JPA & Specification
│   └── entity          # DB Models (User, Game, DownloadToken...)
│
└── frontend (ReactJS)
    ├── src/api         # Axios Client & Interceptors
    ├── src/pages       # Admin Dashboard, Game Detail, Auth
    └── src/components  # Reusable UI (Navbar, Modal, Cards)
⚙️ Cài Đặt & Chạy (Installation)
Yêu cầu:
Java 17+

Node.js 16+

MySQL 8.0

Các bước:
Backend:

Cấu hình database trong application.properties.

Chạy lệnh: ./gradlew bootRun (Flyway sẽ tự động khởi tạo bảng).

Frontend:

Vào thư mục frontend: cd frontend

Cài đặt: npm install

Chạy: npm run dev

Truy cập:

Web: http://localhost:5173
