# Đề tài: XÂY DỰNG WEBSITE BÁN SÁCH

## Giới thiệu

**Tên đề tài:** Xây dựng website bán sách.

Đây là dự án Web nâng cao xây dựng hệ thống bán sách online bằng **Java Spring Boot**. Hệ thống hỗ trợ người dùng đăng ký, đăng nhập, xem sách, quản lý giỏ hàng và xử lý phiên làm việc bằng JWT/Refresh Token.

## Thành viên

| Thành viên | Mã sinh viên |
| --- | --- |
| Trịnh Duy Nam | 23810310255 |
| Phạm Thị Phương | 23810310265 |

## Công nghệ sử dụng

### Backend

- Java 21
- Spring Boot 3.2.2
- Spring Security (JWT + Refresh Token)
- Spring Data JPA / Hibernate
- MySQL
- Maven Wrapper (`mvnw`)

### Frontend (định hướng)

- HTML5, CSS3, JavaScript
- ReactJS

### Công cụ

- Git & GitHub
- Postman
- IntelliJ IDEA / Eclipse / VS Code

## Cấu trúc thư mục

```text
web-project/
├── backend/
│   └── project-web/
│       ├── src/main/java
│       ├── src/main/resources/application.yaml
│       ├── src/test/java
│       ├── pom.xml
│       ├── mvnw
│       └── mvnw.cmd
├── docs/
├── reports/
└── README.md
```

## Hướng dẫn sử dụng

### 1. Yêu cầu môi trường

- JDK 21
- MySQL 8+
- Maven (không bắt buộc nếu dùng `mvnw`)
- Git

### 2. Cấu hình database

Mở file `backend/project-web/src/main/resources/application.yaml` và kiểm tra các thông số:

```yaml
server:
  port: 8181
  servlet:
    context-path: /identity

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/bookstore1
    username: root
    password: root
```

Tạo database trước khi chạy:

```sql
CREATE DATABASE bookstore1;
```

### 3. Chạy project backend

Từ thư mục gốc project:

```powershell
cd backend/project-web
.\mvnw.cmd spring-boot:run
```

Khi chạy thành công, API base URL:

```text
http://localhost:8181/identity
```

### 4. Build và chạy test

```powershell
cd backend/project-web
.\mvnw.cmd clean test
.\mvnw.cmd clean package
```

### 5. Một số API chính để kiểm tra nhanh

- `POST /identity/auth/token` - Đăng nhập, lấy access token
- `POST /identity/auth/refresh` - Làm mới token
- `POST /identity/auth/logout` - Đăng xuất
- `POST /identity/users` - Đăng ký tài khoản
- `GET /identity/users/{id}` - Lấy thông tin người dùng
- `GET /identity/books` - Lấy danh sách sách
- `POST /identity/cart` - Thêm sách vào giỏ hàng

Bạn có thể dùng Postman để import collection và test lần lượt các API trên.

## Chức năng nổi bật

- Xác thực người dùng: đăng ký, đăng nhập, đăng xuất
- Phân quyền cơ bản với role/permission
- Quản lý sách và tìm kiếm sách
- Quản lý giỏ hàng
- Refresh token để duy trì phiên đăng nhập

## Tiến độ công việc

| Ngày | Thành viên | Công việc đã làm | Link SRS |
| --- | --- | --- | --- |
| 2026-03-20 | Trịnh Duy Nam | Khởi tạo project, thiết kế giao diện cơ bản | Chưa có |
| 2026-03-21 | Trịnh Duy Nam | Xây dựng chức năng đăng nhập | [SRS Login](./docs/SRS_LOGIN.md) |
| 2026-03-21 | Trịnh Duy Nam | Xây dựng chức năng đăng ký | [SRS Register](./docs/SRS_REGISTER.md) |
| 2026-03-29 | Phạm Thị Phương | Xây dựng chức năng giỏ hàng | Đang cập nhật |
| 2026-03-29 | Phạm Thị Phương | Xây dựng chức năng quản lý sản phẩm | Đang cập nhật |
| 2026-04-02 | Trịnh Duy Nam | Chức năng làm mới phiên đăng nhập | Đang cập nhật |
| 2026-04-03 | Trịnh Duy Nam | Chức năng đăng xuất | Đang cập nhật |
| 2026-04-04 | Phạm Thị Phương | Chức năng hồ sơ cá nhân | Đang cập nhật |

## Ghi chú

- File này đã được cập nhật theo hướng README có thể dùng để chạy dự án trực tiếp.
- Nếu đổi cấu hình DB hoặc cổng chạy, hãy cập nhật lại `application.yaml` và README để thống nhất.
