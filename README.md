# 🎮 Game Download Platform

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green)
![React](https://img.shields.io/badge/React-18-blue)

> **Một hệ thống phân phối game trực tuyến Full-stack hiệu năng cao, bảo mật và cập nhật theo thời gian thực.**

Dự án cung cấp giải pháp toàn diện cho việc quản lý, tìm kiếm và tải xuống trò chơi với cơ chế bảo vệ link tải **(Anti-leeching)** và **Dashboard quản trị** trực quan theo thời gian thực.

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

| Phân hệ | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Backend** | ![Spring](https://img.shields.io/badge/Spring_Boot-3-green) | Spring Security (JWT), Spring Data JPA (Specification), WebSocket (STOMP), Flyway. |
| **Frontend** | ![React](https://img.shields.io/badge/React-Vite-blue) | Axios Interceptor, React Router, SockJS (Real-time update), TailwindCSS. |
| **Database** | ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue) | Thiết kế tối ưu quan hệ, Quản lý version database tự động bằng Flyway. |
| **Tools** | ![Tools](https://img.shields.io/badge/Tools-Dev-lightgrey) | Postman, IntelliJ IDEA, VS Code, Docker. |

---

## 🚀 Tính Năng Nổi Bật (Key Features)

### 1. 🛡️ Cơ Chế Tải Xuống Bảo Mật (Secure One-time Token)
* **Anti-leeching:** Sử dụng Token dùng 1 lần (One-time use) để ngăn chặn việc chia sẻ link tải trái phép.
* **Rate Limiting:** Giới hạn tần suất tải (ví dụ: 10 phút/lần) để chống spam và bảo vệ băng thông.
* **Smart Delivery:** Hỗ trợ linh hoạt giữa file lưu trữ cục bộ (Local Storage) và chuyển hướng bảo mật (Redirect) cho Cloud Storage (Google Drive, Fshare...).

### 2. ⚡ Dashboard Admin Real-time
* **WebSocket Integration:** Tích hợp **STOMP/SockJS** để cập nhật số liệu (Lượt xem, Lượt tải) ngay lập tức về Dashboard Admin mà không cần reload trang.
* **Statistics:** Biểu đồ và số liệu thống kê trực quan về hiệu suất game, người dùng và danh mục.

### 3. 🔍 Tìm Kiếm & Phân Loại Nâng Cao
* Sử dụng **Spring Data JPA Specification** để xây dựng bộ lọc động (Dynamic Filtering) mạnh mẽ.
* Hỗ trợ tìm kiếm kết hợp nhiều điều kiện: *Từ khóa, Danh mục, Trạng thái, Sắp xếp (Sort & Pagination)*.

### 4. 🔐 Phân Quyền & Bảo Mật (RBAC)
* **JWT Authentication:** Cơ chế xác thực và đăng nhập không trạng thái (Stateless), an toàn và dễ mở rộng.
* **Phân quyền chặt chẽ:**
    * **User:** Xem danh sách game, tìm kiếm, tải game (qua cơ chế bảo mật), xem lịch sử tải cá nhân.
    * **Admin:** Quản lý toàn bộ hệ thống (CRUD Game/User/Category), xem Dashboard thống kê Real-time, quản lý file tải lên.

---

## 📁 Cấu Trúc Dự Án

Hệ thống được tổ chức theo kiến trúc Layered Architecture tiêu chuẩn, dễ dàng bảo trì và mở rộng:

```bash
project-root
├── backend (Spring Boot)
│   ├── config          # Cấu hình Security, WebSocket, JWT, CORS
│   ├── controller      # REST APIs (AdminController, UserController, DownloadController)
│   ├── service         # Xử lý Logic nghiệp vụ (Secure Token, Async tasks)
│   ├── repository      # JPA Repository & Specification Queries
│   └── entity          # Các thực thể DB (User, Game, Category, DownloadToken...)
│   └── exception       # Xử lý các ngoại lệ
│
└── frontend (ReactJS)
    ├── src/api         # Axios Client & Interceptors (Xử lý Token tự động)
    ├── src/pages       # Các màn hình chính (Admin Dashboard, Game Detail, Auth)
    └── src/components  # Các UI Component tái sử dụng (Navbar, Modal, Cards)
