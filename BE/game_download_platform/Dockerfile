# ==========================================
# GIAI ĐOẠN 1: BUILD ỨNG DỤNG (Tạo file .jar)
# ==========================================
# Sử dụng image có sẵn Gradle và JDK 17 để build
FROM gradle:8.5-jdk17 AS builder

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Copy toàn bộ mã nguồn từ máy ông vào trong container
COPY . .

# Chạy lệnh build của Gradle để tạo ra file .jar (bỏ qua chạy test cho nhanh)
RUN ./gradlew bootJar -x test

# ==========================================
# GIAI ĐOẠN 2: CHẠY ỨNG DỤNG
# ==========================================
# Chỉ sử dụng JRE/JDK 17 bản nhẹ (slim) để chạy, giúp giảm dung lượng
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy DUY NHẤT file .jar đã được build thành công từ Giai đoạn 1 sang Giai đoạn 2
COPY --from=builder /app/build/libs/*.jar app.jar

# Khai báo cổng mà Spring Boot đang sử dụng (mặc định là 8080)
EXPOSE 8080

# Lệnh để khởi động ứng dụng khi container chạy
ENTRYPOINT ["java", "-jar", "app.jar"]