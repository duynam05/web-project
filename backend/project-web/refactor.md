# Refactor Summary

## 1) Các luồng vừa refactor (ngắn gọn)

- Chuyển cấu hình auth sang env/.env:
    - `JWT_SIGNER_KEY`, `JWT_VALID_DURATION`, `JWT_REFRESHABLE_DURATION`
    - `APP_BOOTSTRAP_ADMIN_ENABLED`, `APP_BOOTSTRAP_ADMIN_EMAIL`, `APP_BOOTSTRAP_ADMIN_PASSWORD`, `APP_BOOTSTRAP_ADMIN_FULL_NAME`
- Startup seed admin theo env (create-once):
    - đảm bảo role `USER` và `ADMIN` luôn tồn tại
    - chỉ tạo admin nếu email chưa có trong DB
    - nếu bật bootstrap mà thiếu email/password thì fail startup rõ ràng (`BOOTSTRAP_CONFIG_MISSING`)
- Tách onboarding user:
    - thêm `POST /auth/register` (public) để đăng ký user mua hàng
    - `POST /users` không còn public, chuyển thành luồng quản trị (admin-only)
- Bổ sung quản lý mật khẩu và trạng thái tài khoản:
    - thêm `POST /auth/change-password` (đăng nhập rồi mới đổi)
    - thêm `PATCH /users/{userId}/status` để admin đổi `ACTIVE`/`DISABLED`
    - login/refresh/introspect sẽ chặn user `DISABLED` (`ACCOUNT_DISABLED`)
- Cập nhật security public endpoint:
    - public: `POST /auth/register`, `POST /auth/token`, `POST /auth/introspect`, `POST /auth/refresh`, `POST /auth/logout`, `GET /books`
    - còn lại bắt buộc Bearer token

## 2) API hiện tại

Base URL: `http://localhost:8080`

### Auth

| Method | Path | Auth | Ghi chú |
|---|---|---|---|
| POST | `/auth/register` | Public | Đăng ký user mới, trả `UserResponse` |
| POST | `/auth/token` | Public | Đăng nhập lấy JWT |
| POST | `/auth/introspect` | Public | Kiểm tra token hợp lệ |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | Public | Invalidate token |
| POST | `/auth/change-password` | Bearer token | Đổi mật khẩu bằng `currentPassword/newPassword` |

### Users

| Method | Path | Auth | Ghi chú |
|---|---|---|---|
| POST | `/users` | Bearer token + `ADMIN` | Tạo user theo luồng quản trị |
| GET | `/users` | Bearer token + `ADMIN` | Danh sách user |
| GET | `/users/{userId}` | Bearer token + `ADMIN` | Chi tiết user |
| GET | `/users/my-info` | Bearer token | Thông tin user hiện tại |
| PUT | `/users/me` | Bearer token | Cập nhật profile (không đổi password) |
| PUT | `/users/{userId}` | Bearer token + `ADMIN` | Cập nhật user (fullName/roles) |
| PATCH | `/users/{userId}/status` | Bearer token + `ADMIN` | Đổi `ACTIVE`/`DISABLED` |
| DELETE | `/users/{userId}` | Bearer token + `ADMIN` | Xóa user |

### Books

| Method | Path | Auth | Ghi chú |
|---|---|---|---|
| GET | `/books` | Public | Lấy danh sách sách |
| POST | `/books` | Bearer token | Tạo sách |

### Cart

| Method | Path | Auth | Ghi chú |
|---|---|---|---|
| GET | `/cart` | Bearer token | Xem giỏ hàng hiện tại |
| POST | `/cart` | Bearer token | Thêm item vào giỏ |
| PUT | `/cart/{id}` | Bearer token | Cập nhật số lượng |
| DELETE | `/cart/{id}` | Bearer token | Xóa 1 item |
| DELETE | `/cart/clear` | Bearer token | Xóa toàn bộ giỏ |

### Orders

| Method | Path | Auth | Ghi chú |
|---|---|---|---|
| POST | `/api/orders` | Bearer token | Tạo đơn từ giỏ hàng |
| GET | `/api/orders` | Bearer token | Danh sách đơn của user |
| GET | `/api/orders/{orderId}` | Bearer token | Chi tiết đơn |
| POST | `/api/orders/{orderId}/payment` | Bearer token | Thanh toán đơn (luồng nội bộ) |

### Roles

| Method | Path | Auth | Ghi chú |
|---|---|---|---|
| POST | `/roles` | Bearer token | Tạo role |
| GET | `/roles` | Bearer token | Danh sách role |
| DELETE | `/roles/{role}` | Bearer token | Xóa role |

### Permissions

| Method | Path | Auth | Ghi chú |
|---|---|---|---|
| POST | `/permissions` | Bearer token | Tạo permission |
| GET | `/permissions` | Bearer token | Danh sách permission |
| DELETE | `/permissions/{permission}` | Bearer token | Xóa permission |
