# Website bán sách

## Tên đề tài

Xây dựng Website Bán sách online N&P.

## Giới thiệu website/hệ thống

Đây là hệ thống website bán sách gồm 3 phần chính:

- `backend/project-web`: REST API xây dựng bằng Spring Boot.
- `Frontend/bookstore-ui`: giao diện khách hàng xây dựng bằng React.
- `Frontend/bookstore-admin`: giao diện quản trị xây dựng bằng React + Vite.

Hệ thống hỗ trợ khách hàng đăng ký, đăng nhập, xem sách, tìm kiếm sách, xem chi tiết sách, quản lý giỏ hàng, đặt hàng, thanh toán và theo dõi đơn hàng. Quản trị viên có thể quản lý người dùng, sách, đơn hàng, đánh giá, cấu hình hệ thống và theo dõi số liệu tổng quan trên dashboard.

## Danh sách thành viên

| STT | Họ và tên | MSSV |
| --- | --- | --- |
| 1 | Trịnh Duy Nam | 23810310255 |
| 2 | Phạm Thị Phượng | 23810310265 |

## Phân công nhiệm vụ cụ thể

| Thành viên | Nhiệm vụ |
| --- | --- |
| Trịnh Duy Nam | Khởi tạo project, xây dựng backend Spring Boot, thiết kế database, cấu hình bảo mật JWT, đăng nhập/đăng ký/đăng xuất, refresh token, đổi mật khẩu, quản lý người dùng, phân quyền role/permission, upload ảnh sách, dashboard quản trị, quản lý đơn hàng phía admin, quản lý đánh giá, cấu hình thanh toán và triển khai hệ thống. |
| Phạm Thị Phượng | Xây dựng chức năng quản lý sách, giao diện khách hàng, danh sách sách, chi tiết sách, giỏ hàng, cập nhật/xóa sản phẩm trong giỏ, đặt hàng, xem danh sách đơn hàng và hỗ trợ hoàn thiện tài liệu SRS. |

## Công nghệ sử dụng

### Backend

- Java 21
- Spring Boot 3.2.2
- Spring Security
- Spring Data JPA / Hibernate
- OAuth2 Resource Server / JWT
- MySQL 8
- Maven Wrapper
- Docker / Docker Compose
- Cloudinary
- PayOS / chuyển khoản ngân hàng
- Lombok, MapStruct
- JUnit, Spring Security Test, H2 Database

### Frontend người dùng

- React 18
- React Router DOM
- React Scripts
- Lucide React
- React Toastify
- jwt-decode

### Frontend quản trị

- React 19
- Vite
- ESLint
- Tailwind CSS
- gh-pages

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
|-- assets/
|-- database/
|-- docs/
|-- reports/
|-- DECUONG.md
`-- README.md
```

## Chức năng chính

### Khách hàng

- Đăng ký, đăng nhập, đăng xuất.
- Làm mới token và đổi mật khẩu.
- Xem trang chủ, danh sách sách, chi tiết sách.
- Tìm kiếm và lọc sách.
- Thêm sách vào giỏ hàng, cập nhật số lượng, xóa sách khỏi giỏ.
- Đặt hàng và chọn phương thức thanh toán.
- Xem lịch sử đơn hàng và chi tiết đơn hàng.
- Quản lý thông tin tài khoản cá nhân.

### Quản trị viên

- Đăng nhập tài khoản có quyền `ADMIN`.
- Xem dashboard tổng quan.
- Quản lý người dùng.
- Quản lý sách.
- Quản lý đơn hàng.
- Quản lý đánh giá.
- Cấu hình hệ thống.

### Backend API

- Xác thực và phân quyền theo role.
- CRUD user, role, permission.
- CRUD book.
- Quản lý giỏ hàng.
- Tạo đơn hàng, xem đơn hàng, cập nhật trạng thái đơn hàng.
- Upload ảnh sách.
- Quản lý phiên thanh toán.

## Hướng dẫn cài đặt

### Yêu cầu môi trường

- Java 21
- Node.js 18+ và npm
- MySQL 8+ nếu chạy database local
- Docker Desktop nếu chạy backend và MySQL bằng Docker Compose

### Cài đặt backend

1. Vào thư mục backend:

```powershell
cd backend/project-web
```

2. Tạo database nếu chạy MySQL local:

```sql
CREATE DATABASE bookstore1;
```

3. Tạo file `.env` trong thư mục `backend/project-web` và cấu hình các biến cần thiết:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3307/bookstore1
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
JWT_SIGNER_KEY=your-secret-key
APP_BOOTSTRAP_ADMIN_ENABLED=true
APP_BOOTSTRAP_ADMIN_EMAIL=admin@admin.com
APP_BOOTSTRAP_ADMIN_PASSWORD=12345678
APP_BOOTSTRAP_ADMIN_FULL_NAME=Administrator
```

Các cấu hình Cloudinary và PayOS có thể bổ sung trong `.env` khi cần dùng upload ảnh hoặc thanh toán thật.

### Cài đặt frontend người dùng

```powershell
cd Frontend/bookstore-ui
npm install
```

Nếu cần đổi API backend, cấu hình trong file `Frontend/bookstore-ui/src/config/api.js` hoặc dùng biến môi trường `REACT_APP_API_BASE_URL`.

### Cài đặt frontend quản trị

```powershell
cd Frontend/bookstore-admin
npm install
```

Nếu cần đổi API backend, cấu hình trong file `Frontend/bookstore-admin/src/config/api.js` hoặc dùng biến môi trường `VITE_API_BASE_URL`.

## Hướng dẫn chạy project

### Chạy backend bằng Docker Compose

Từ thư mục `backend/project-web`:

```powershell
docker compose up --build
```

Mặc định:

- MySQL chạy tại `localhost:3307`.
- Backend chạy tại `http://localhost:8080`.

### Chạy backend local bằng Maven

Từ thư mục `backend/project-web`:

```powershell
.\mvnw.cmd spring-boot:run
```

### Chạy frontend người dùng

Từ thư mục `Frontend/bookstore-ui`:

```powershell
npm start
```

Frontend người dùng mặc định chạy tại:

```text
http://localhost:3000
```

### Chạy frontend quản trị

Từ thư mục `Frontend/bookstore-admin`:

```powershell
npm run dev
```

Frontend quản trị thường chạy tại:

```text
http://localhost:5173
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

## Tài khoản demo

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| User demo | `a@gmail.com` | `123456` |
| Admin demo | `admin@admin.com` | `12345678` |

Ghi chú: với môi trường local, tài khoản admin demo được tạo khi cấu hình `APP_BOOTSTRAP_ADMIN_ENABLED=true` và cung cấp email/mật khẩu admin trong file `.env`.

## Hình ảnh minh họa hệ thống

### Giao diện người dùng

![Trang chủ](<./assets/user/trang chủ/1.png>)
![Đăng nhập](<./assets/user/đăng nhập/1.png>)
![Đăng kí](<./assets/user/đăng kí/1.png>)
![Danh sách sách](<./assets/user/sách/1.png>)
![Chi tiết sách](<./assets/user/chi tiết sách/1.png>)
![Giỏ hàng](<./assets/user/giỏ hàng/1.png>)
![Thanh toán 1](<./assets/user/thanh toán/1.png>)
![Thanh toán 2](<./assets/user/thanh toán/2.png>)
![Đơn hàng 1](<./assets/user/đơn hàng/1.png>)
![Đơn hàng 2](<./assets/user/đơn hàng/2.png>)
![Quản lý hồ sơ 1](<./assets/user/quản lý hồ sơ/1.png>)
![Quản lý hồ sơ 2](<./assets/user/quản lý hồ sơ/2.png>)
![Quản lý hồ sơ 3](<./assets/user/quản lý hồ sơ/3.png>)

### Giao diện quản trị

![Bảng điều khiển 1](<./assets/admin/bảng điều khiển/1.png>)
![Bảng điều khiển 2](<./assets/admin/bảng điều khiển/2.png>)
![Quản lý người dùng 1](<./assets/admin/quản lý người dùng/1.png>)
![Quản lý người dùng 2](<./assets/admin/quản lý người dùng/2.png>)
![Quản lý người dùng 3](<./assets/admin/quản lý người dùng/3.png>)
![Quản lý người dùng 4](<./assets/admin/quản lý người dùng/4.png>)
![Quản lý sách 1](<./assets/admin/quản lý sách/1.png>)
![Quản lý sách 2](<./assets/admin/quản lý sách/2.png>)
![Quản lý sách 3](<./assets/admin/quản lý sách/3.png>)
![Quản lý sách 4](<./assets/admin/quản lý sách/4.png>)
![Quản lý đơn hàng 1](<./assets/admin/quản lý đơn hàng/1.png>)
![Quản lý đơn hàng 2](<./assets/admin/quản lý đơn hàng/2.png>)
![Quản lý đánh giá 1](<./assets/admin/quản lý đánh giá/1.png>)
![Quản lý đánh giá 2](<./assets/admin/quản lý đánh giá/2.png>)
![Cài đặt 1](<./assets/admin/cài đặt/1.png>)
![Cài đặt 2](<./assets/admin/cài đặt/2.png>)
![Cài đặt 3](<./assets/admin/cài đặt/3.png>)

## Link video demo

- Chưa cập nhật.

## Link online đã deploy

- Frontend user: <https://duynam05.github.io/web-project/>
- Frontend admin: <https://duynam05.github.io/web-project/admin/>
- Backend API: <https://web-project-7cxd.onrender.com>

## Tài liệu liên quan

- [Đề cương đề tài](./DECUONG.md)
- [SRS đăng nhập](./docs/SRS_AUTH_LOGIN.md)
- [SRS đăng ký](./docs/SRS_AUTH_REGISTER.md)
- [SRS quản lý sách](./docs/SRS_BOOK_MANAGEMENT.md)
- [SRS quản lý giỏ hàng](./docs/SRS_CART_MANAGEMENT.md)
- [SRS quản lý đơn hàng](./docs/SRS_ORDER_MANAGEMENT.md)
- [SRS dashboard quản trị](./docs/SRS_ADMIN_DASHBOARD.md)

## Ghi chú

- Backend mặc định dùng port `8080`.
- Frontend người dùng và frontend quản trị là 2 ứng dụng riêng.
- Để đăng nhập vào admin, tài khoản cần có role `ADMIN`.
- Nếu chạy local, cần kiểm tra cấu hình database, JWT và API URL trước khi chạy.
