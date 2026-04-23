# Web Project - Bookstore

## Giới thiệu

Đây là dự án website bán sách gồm 3 phần chính:

- `backend/project-web`: REST API xây dựng bằng Spring Boot
- `Frontend/bookstore-ui`: giao diện người dùng xây dựng bằng React
- `Frontend/bookstore-admin`: giao diện quản trị xây dựng bằng React + Vite

Hệ thống hỗ trợ các chức năng chính như đăng ký, đăng nhập, quản lý người dùng, sách, giỏ hàng, đơn hàng và một số thao tác quản trị.

## Thành viên

| Thành viên | Mã sinh viên |
| --- | --- |
| Trịnh Duy Nam | 23810310255 |
| Phạm Thị Phượng | 23810310265 |

## Công nghệ sử dụng

### Backend

- Java 21
- Spring Boot 3.2.x
- Spring Security
- Spring Data JPA / Hibernate
- MySQL
- Maven Wrapper
- Docker / Docker Compose
- Cloudinary

### Frontend người dùng

- React 18
- React Router DOM
- React Scripts
- Lucide React

### Frontend quản trị

- React
- Vite
- ESLint

## Cấu trúc thư mục

```text
web-project/
|-- backend/
|   `-- project-web/
|       |-- src/
|       |-- pom.xml
|       |-- Dockerfile
|       `-- docker-compose.yml
|-- Frontend/
|   |-- bookstore-ui/
|   `-- bookstore-admin/
|-- docs/
|-- reports/
|-- DECUONG.md
`-- README.md
```

## Chức năng chính

### Người dùng

- Đăng ký, đăng nhập, đăng xuất
- Làm mới token, đổi mật khẩu
- Xem danh sách sách, chi tiết sách
- Thêm vào giỏ hàng, cập nhật số lượng, xóa sản phẩm trong giỏ
- Đặt hàng và chọn phương thức thanh toán
- Xem thông tin tài khoản

### Quản trị

- Xác thực tài khoản `ADMIN`
- Xem dashboard
- Quản lý người dùng
- Quản lý sách
- Quản lý đơn hàng

### Backend API

- Xác thực và phân quyền theo role
- CRUD user, role, permission
- CRUD book
- Quản lý giỏ hàng
- Tạo đơn hàng, xem đơn hàng, cập nhật trạng thái đơn hàng
- Upload ảnh sách

## Một số endpoint chính

API backend mặc định chạy tại:

```text
http://localhost:8080
```

Một số endpoint tiêu biểu:

- `POST /auth/register`
- `POST /auth/token`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/change-password`
- `GET /users`
- `GET /users/my-info`
- `GET /books`
- `GET /books/{id}`
- `POST /books`
- `POST /books/upload-image`
- `GET /cart`
- `POST /cart`
- `PUT /cart/{id}`
- `DELETE /cart/{id}`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/admin`
- `PATCH /api/orders/admin/{orderId}/status`

## Yêu cầu môi trường

- Java 21
- Node.js 18+ và npm
- MySQL 8+ nếu chạy local
- Docker Desktop nếu chạy bằng Docker

## Cấu hình backend

File cấu hình chính:

```text
backend/project-web/src/main/resources/application.yaml
```

Một số cấu hình cần chú ý:

- Cổng chạy backend: `8080`
- Kết nối MySQL
- JWT signer key
- Tài khoản admin khởi tạo ban đầu
- Cấu hình Cloudinary nếu cần upload ảnh

Nếu chạy local, cần bảo đảm database sử dụng đúng tên:

```sql
CREATE DATABASE bookstore1;
```

## Cách chạy backend

### Cách 1: chạy bằng Docker Compose

Từ thư mục `backend/project-web`:

```powershell
docker compose up --build
```

Mặc định:

- MySQL chạy qua cổng `3307`
- Backend chạy qua cổng `8080`

### Cách 2: chạy local bằng Maven

```powershell
cd backend/project-web
.\mvnw.cmd spring-boot:run
```

## Cách chạy frontend người dùng

Từ thư mục `Frontend/bookstore-ui`:

```powershell
npm install
npm start
```

Frontend người dùng mặc định chạy tại:

```text
http://localhost:3000
```

Cấu hình API frontend người dùng nằm trong:

```text
Frontend/bookstore-ui/src/config/api.js
```

## Cách chạy frontend quản trị

Từ thư mục `Frontend/bookstore-admin`:

```powershell
npm install
npm run dev
```

Frontend quản trị thường chạy tại:

```text
http://localhost:5173
```

Cấu hình API frontend quản trị nằm trong:

```text
Frontend/bookstore-admin/src/config/api.js
```

## Build và test

### Backend

```powershell
cd backend/project-web
.\mvnw.cmd clean test
.\mvnw.cmd clean package
```

### Frontend người dùng

```powershell
cd Frontend/bookstore-ui
npm run build
```

### Frontend quản trị

```powershell
cd Frontend/bookstore-admin
npm run build
```

## Tiến độ công việc

| Ngày | Thành viên | Công việc đã làm | Link SRS |
| --- | --- | --- | --- |
| 2026-03-20 | Trịnh Duy Nam | Khởi tạo project, thiết kế giao diện cơ bản | Chưa có |
| 2026-03-21 | Trịnh Duy Nam | Xây dựng chức năng đăng nhập | [SRS Login](./docs/SRS_LOGIN.md) |
| 2026-03-21 | Trịnh Duy Nam | Xây dựng chức năng đăng ký | [SRS Register](./docs/SRS_Register.md) |
| 2026-03-22 | Trịnh Duy Nam | Xây dựng chức năng xác thực bằng JWT, refresh token và đăng xuất | [SRS Login](./docs/SRS_LOGIN.md) |
| 2026-03-24 | Trịnh Duy Nam | Xây dựng chức năng đổi mật khẩu, lấy thông tin cá nhân và cập nhật hồ sơ người dùng | Đang cập nhật |
| 2026-03-27 | Trịnh Duy Nam | Xây dựng chức năng phân quyền với user, role, permission | [User Management](./docs/User%20Management.md) |
| 2026-03-29 | Phạm Thị Phượng | Xây dựng chức năng quản lý sách: thêm, sửa, xóa, xem danh sách, xem chi tiết | [Đang cập nhật](https://github.com/duynam05/web-project/commit/04c1610c6200e23960a1615c87f023e20e6a81d8) |
| 2026-04-16 | Trịnh Duy Nam | Tích hợp upload ảnh sách | Đang cập nhật |
| 2026-04-16 | Phạm Thị Phượng | Xây dựng chức năng giỏ hàng: thêm sản phẩm, cập nhật số lượng, xóa sản phẩm, xóa toàn bộ giỏ hàng | Đang cập nhật |
| 2026-04-18 | Phạm Thị Phượng | Xây dựng chức năng đặt hàng và xem danh sách đơn hàng của người dùng | Đang cập nhật |
| 2026-04-18 | Trịnh Duy Nam | Hoàn thiện chức năng hồ sơ cá nhân và trang tài khoản người dùng | Đang cập nhật |
| 2026-04-19 | Phạm Thị Phượng | Xây dựng giao diện người dùng gồm trang chủ, danh sách sách, chi tiết sách, giỏ hàng, đăng nhập, đăng ký | Đang cập nhật |
| 2026-04-19 | Phạm Thị Phượng | Xây dựng chức năng checkout và luồng thanh toán giả lập VNPay | Đang cập nhật |
| 2026-04-21 | Trịnh Duy Nam | Xây dựng giao diện quản trị: dashboard, quản lý người dùng, quản lý sách, quản lý đơn hàng | Đang cập nhật |
| 2026-04-21 | Trịnh Duy Nam | Xây dựng chức năng admin cập nhật trạng thái đơn hàng và kiểm tra quyền ADMIN | [Báo cáo 2026-04-08](./reports/REPORT_20260408.md) |


## Ghi chú

- Backend hiện tại mặc định dùng port `8080`
- Frontend người dùng và frontend quản trị là 2 ứng dụng riêng
- Để đăng nhập vào admin, tài khoản cần có role `ADMIN`
- Nếu chạy local, cần kiểm tra lại cấu hình database và API trước khi chạy
