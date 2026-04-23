# Software Requirement Specification (SRS)

## Chức năng: Quản lý người dùng (User Management)

**Mã chức năng:** USER-01  
**Trạng thái:** Updated  
**Người soạn thảo:** Phạm Thị Phượng  

---

# 1. Mô tả tổng quan (Description)

Chức năng cho phép quản trị viên (ADMIN) và người dùng (USER) quản lý thông tin tài khoản trong hệ thống.

Hệ thống hỗ trợ:

- Đăng ký tài khoản mới
- Xem thông tin người dùng
- Cập nhật thông tin cá nhân
- Quản lý trạng thái tài khoản (ACTIVE / DISABLED)
- Xóa người dùng (ADMIN)
- Xem danh sách người dùng (ADMIN)

Người dùng chỉ có thể thao tác trên chính tài khoản của mình, trong khi ADMIN có toàn quyền quản lý user.

---

# 2. Luồng nghiệp vụ (User Workflow)

## 2.1 Luồng đăng ký và đăng nhập

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Đăng ký tài khoản | POST /auth/register |
| 2 | Nhập email + password | Hệ thống validate dữ liệu |
| 3 | Tạo tài khoản thành công | Trả về UserResponse |
| 4 | Đăng nhập | POST /auth/token |
| 5 | Nhận JWT token | Trả về access token |

---

## 2.2 Luồng người dùng (USER)

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Xem thông tin cá nhân | GET /users/my-info |
| 2 | Cập nhật thông tin | PUT /users/me |
| 3 | Thay đổi mật khẩu | POST /auth/change-password |
| 4 | Kiểm tra trạng thái | JWT + ACTIVE validation |

---

## 2.3 Luồng quản trị (ADMIN)

| Bước | Hành động ADMIN | Phản hồi hệ thống |
|------|----------------|-------------------|
| 1 | Xem danh sách user | GET /users |
| 2 | Xem chi tiết user | GET /users/{userId} |
| 3 | Cập nhật user | PUT /users/{userId} |
| 4 | Thay đổi trạng thái | PATCH /users/{userId}/status |
| 5 | Xóa user | DELETE /users/{userId} |
| 6 | Tạo user hệ thống | POST /users |

---

# 3. Yêu cầu dữ liệu chi tiết (Detailed Data Requirements)

## 3.1 Input Validation

### Full Name
- Kiểu: String  
- Bắt buộc  
- Tối đa: 255 ký tự  

### Email
- Kiểu: String  
- Bắt buộc  
- Định dạng email hợp lệ  
- UNIQUE trong hệ thống  

### Password
- Kiểu: String  
- Bắt buộc khi đăng ký  
- Được mã hóa (BCrypt)  

### Phone Number
- Kiểu: String  
- 10 chữ số  
- UNIQUE  

### Status
- Kiểu: Enum  
- Giá trị: ACTIVE, DISABLED  

---

# 4. Database Logic (Table: users)

- id (UUID) – khóa chính  
- email – đăng nhập  
- password – mật khẩu mã hóa  
- full_name – tên người dùng  
- phone_number – số điện thoại  
- status – trạng thái tài khoản  
- roles – danh sách quyền  
- created_at – thời gian tạo  
- updated_at – thời gian cập nhật  

---

# 5. API Reference (Updated)

## 5.1 Auth APIs (Public)

| Method | Endpoint | Mô tả |
|--------|----------|------|
| POST | /auth/register | Đăng ký user |
| POST | /auth/token | Đăng nhập |
| POST | /auth/introspect | Kiểm tra token |
| POST | /auth/refresh | Refresh token |
| POST | /auth/logout | Đăng xuất |
| POST | /auth/change-password | Đổi mật khẩu |

---

## 5.2 User APIs

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|------|------|
| GET | /users | ADMIN | Danh sách user |
| GET | /users/{userId} | ADMIN | Chi tiết user |
| GET | /users/my-info | USER | Thông tin cá nhân |
| PUT | /users/me | USER | Cập nhật profile |
| POST | /users | ADMIN | Tạo user |
| PUT | /users/{userId} | ADMIN | Cập nhật user |
| PATCH | /users/{userId}/status | ADMIN | Đổi trạng thái |
| DELETE | /users/{userId} | ADMIN | Xóa user |

---

# 6. Ràng buộc & Bảo mật (Constraints & Security)

## Authentication

Authorization header:
Authorization: Bearer <JWT_TOKEN>

## Roles

| Role   | Quyền |
|--------|------|
| USER   | Xem và cập nhật thông tin cá nhân |
| ADMIN  | Quản lý toàn bộ user |
| SYSTEM | Seed dữ liệu ban đầu |

---

## Business Rules

- User DISABLED không thể login hoặc refresh token  
- Email là duy nhất  
- Password phải được mã hóa  
- USER chỉ được update profile của chính mình  
- ADMIN có toàn quyền CRUD user  

---

# 7. Danh mục lỗi (Error Handling)

| Mã lỗi  | Trường hợp              | Thông báo            |
|---------|------------------------|----------------------|
| AUTH_01 | Token không hợp lệ     | Unauthorized         |
| AUTH_02 | User bị DISABLED       | Account disabled     |
| USER_01 | Email đã tồn tại       | Email already exists |
| USER_02 | Không tìm thấy user    | User not found       |
| USER_03 | Sai mật khẩu           | Invalid credentials  |
| USER_04 | Không đủ quyền         | Forbidden            |

---

# 8. Giao diện (UI/UX Specification)

## 8.1 Trang Profile (User)

- Xem thông tin cá nhân  
- Cập nhật full name, phone, address  
- Đổi mật khẩu  

## 8.2 Trang Admin User Management

- Danh sách user (table)  
- Filter theo status  

### Actions

- View detail  
- Update  
- Delete  
- Change status  

---

# 9. Sequence Flow

## 9.1 Đăng ký user

Client → POST /auth/register → AuthenticationService → DB → Response

---

## 9.2 Đăng nhập

Client → POST /auth/token → AuthenticationService → JWT → Response

---

## 9.3 Cập nhật profile

Client → PUT /users/me → Security Filter → UserService → DB → Response

---

## 9.4 Admin update status

Client → PATCH /users/{id}/status → Security (ADMIN) → UserService → DB → Response
