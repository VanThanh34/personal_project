# ==========================================
# GIAI ĐOẠN 1: BUILD GIAO DIỆN (Dùng Node.js)
# ==========================================
# Sử dụng Node.js bản 18 (hoặc bản ông đang dùng trên máy)
FROM node:18-alpine AS builder

# Đặt thư mục làm việc
WORKDIR /app

# Copy 2 file package.json và package-lock.json vào trước
# Việc này giúp Docker tận dụng cache, cài NPM nhanh hơn ở các lần sau
COPY package*.json ./

# Cài đặt các thư viện (node_modules)
RUN npm install

# Copy toàn bộ code Frontend vào container
COPY . .

# Chạy lệnh build ra file tĩnh (HTML, CSS, JS)
RUN npm run build

# ==========================================
# GIAI ĐOẠN 2: CHẠY GIAO DIỆN BẰNG NGINX
# ==========================================
# Sử dụng Nginx bản nhẹ (alpine)
FROM nginx:alpine

# Xóa trang web mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy các file tĩnh đã build từ Giai đoạn 1 sang thư mục của Nginx
# LƯU Ý QUAN TRỌNG: Sửa chữ 'dist' thành 'build' nếu ông dùng Create React App
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80 cho web
EXPOSE 80

# Lệnh khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]