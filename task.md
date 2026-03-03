# 📋 Danh Sách Chức Năng Đã Hoàn Thành (Game Download Platform)

Dưới đây là danh sách tổng hợp toàn bộ các tính năng đã được triển khai ở cả Frontend (FE) và Backend (BE).

## 1. 🖥️ Frontend (ReactJS)
**Cấu trúc & Giao diện:**
- Chia tách các component Layout (Header, Footer, Navbar) để tái sử dụng.
- Quản lý trạng thái thông qua \`context\` API (như quản lý trạng thái đăng nhập cửa người dùng).

**Các trang đã hoàn thành (Pages):**
- **Xác thực (Auth):**
  - Đăng nhập (\`LoginPage.jsx\`).
  - Đăng ký (\`RegisterPage.jsx\`).
  - Xác minh tài khoản qua email (\`VerifyAccountPage.jsx\`).
- **Người dùng & Trình duyệt (User & Main):**
  - Trang chủ (\`HomePage.jsx\`): Nơi hiển thị các banner và game tổng quan nổi bật.
  - Trang danh mục (\`CategoryPage.jsx\`): Lọc và hiển thị danh sách game theo các thể loại.
  - Chi tiết Game (\`GameDetailPage.jsx\`): Xem thông tin hình ảnh, miêu tả, cấu hình tối thiểu và thực hiện tải game xuống.
  - Top Game (\`TopGamesPage.jsx\`): Lọc các game có lượt xem/tải nhiều nhất.
  - Kênh cộng đồng (\`CommunityPage.jsx\`): Cung cấp đường dẫn vào Discord và Facebook liên hệ.
  - Lịch sử tải (\`HistoryPage.jsx\`): Cho phép người dùng theo dõi lịch sử và các game bản thân đã tải.
- **Quản trị viên (Admin):**
  - Tổng quan (\`Dashboard.jsx\`, \`AdminDashboard.jsx\`): Vẽ biểu đồ, liệt kê thống kê số liệu của hệ thống.
  - Quản lý kho Game (\`GameManager.jsx\`): Hỗ trợ thêm mới, sửa đổi, kiểm tra và xóa game.
  - Quản lý Người Dùng (\`UserManager.jsx\`): Giám sát, phân quyền, hoặc cấm tài khoản người dùng.

## 2. ⚙️ Backend (Spring Boot)
**Hệ thống thực thể (Entities / Cơ sở dữ liệu):**
- \`User\`, \`Role\`: Quản lý tài khoản và quyền của người dùng.
- \`Game\`, \`Category\`: Quản lý thông tin chi tiết game và các thể loại của game.
- \`VerificationToken\`: Ghi nhận mã xác minh email đăng nhập.
- \`Download\`: Bảng lưu vết, thống kê lịch sử tải game.
- \`DownloadToken\`: Tạo link/mã giới hạn chỉ dùng một lần (một trong những tính năng bảo vệ hệ thống tải ấn tượng nhất).

**Hệ thống API và Logic (Controllers):**
- **Quản lý Quyền truy cập (\`AuthController\`):**
  - Authentication thông qua JWT token (Đăng nhập, đăng ký, verify Email).
- **Hệ thống Quản trị (\`Admin(Game/User/Statistics/...)Controller\`):**
  - Cung cấp API đầy đủ các tác vụ CRUD (Thêm, Xóa, Sửa, Lấy) cho người dùng, cũng như thao tác với kho game.
  - Cung cấp API tổng hợp dữ liệu, báo cáo doanh thu, lượt tương tác trong ngày/tháng để đưa lên bảng hiển thị của Admin.
- **Truy xuất dữ liệu Game (\`GameController\`, \`GameStatsController\`):**
  - API trả về danh sách Top Game, thông tin theo Catgory, lọc tìm kiếm.
  - Đếm và cập nhật số lượt xem/ lượt yêu thích.
- **Xử lý an toàn khi tải file (\`DownloadController\`, \`DownloadGameController\`):**
  - Gen URL bảo mật bằng luồng Token.
  - Kiểm định Session xem đã đăng nhập để tải game chưa. Cập nhật vào lịch sử tải cho người dùng.

## 3. 🚀 Tóm tắt Toàn Bộ Tính Năng Cốt Lõi Dự Án
- [x] **Tính năng thành viên & Bảo mật:** Đăng ký, đăng nhập bằng token, hệ thống xác nhận đăng ký bằng Email, hệ thống phân quyền (User vs Admin).
- [x] **Duyệt và Tương tác Game:** Hiển thị game đa dạng ở Trang chủ, xếp hạng game, phân loại thể loại game, giao diện xem chi tiết về trò chơi đó.
- [x] **Tính năng Xã hội/Cộng đồng:** Màn hình giới thiệu kênh Discord và mạng xã hội.
- [x] **Quản lý Lịch sử tải xuống:** Theo dõi số lượng download của game, gắn với tài khoản đang đăng nhập.
- [x] **Tính năng Tải Game Riêng Tư / An Toàn:** Cung cấp URL tải một lần (One-Time Token Download) giúp tránh chia sẻ trực tiếp link file ra public.
- [x] **Hệ thống Dashboard Admin:** Màn hình quản trị mạnh mẽ với biểu đồ trực quan, quản lý tất cả game bằng Form, và quản lý bảo mật thành viên cực gắt gao.

---
*Vui lòng đánh dấu **[x]** hoặc bổ sung thêm vào các công việc nếu bạn muốn phát triển mới các chức năng trên này!*
