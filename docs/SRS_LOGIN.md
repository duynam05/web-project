# Software Requirement Specification (SRS)

## Chức năng: Đăng nhập (User Authentication)

**Mã chức năng:** AUTH-01  
**Trạng thái:** Completed  
**Người soạn thảo:** Trịnh Duy Nam

---

### 1. Mô tả tổng quan (Description)
Chức năng đăng nhập cho phép người dùng truy cập vào hệ thống website bán sách bằng tài khoản đã đăng ký. Hệ thống đảm bảo bảo mật thông tin người dùng và kiểm soát truy cập.

---

### 2. Luồng nghiệp vụ (User Workflow)

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|---------------------|------------------|
| 1 | Truy cập trang `/login` | Hiển thị form đăng nhập |
| 2 | Nhập email và mật khẩu | Kiểm tra dữ liệu đầu vào |
| 3 | Nhấn nút "Đăng nhập" | Gửi request lên server |
| 4 | Thông tin đúng | Đăng nhập thành công, chuyển về trang chủ |
| 5 | Thông tin sai | Hiển thị lỗi |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1 Input
- **Email:** string, bắt buộc, đúng định dạng
- **Password:** string, tối thiểu 6 ký tự

#### 3.2 Database (users)
- email (unique)
- password (hashed)
- role
- created_at

---

### 4. Ràng buộc & bảo mật (Constraints)

- Sử dụng HTTPS
- Mật khẩu được mã hóa (bcrypt)
- Không lưu password dạng plaintext
- Giới hạn số lần đăng nhập sai (5 lần)

---

### 5. Xử lý lỗi (Edge Cases)

- Sai email → "Email không tồn tại"
- Sai mật khẩu → "Mật khẩu không đúng"
- Tài khoản bị khóa → "Tài khoản bị khóa"

---

### 6. Giao diện (UI/UX)

- Form gồm: Email, Password
- Có nút "Đăng nhập"
- Có thông báo lỗi rõ ràng
- Responsive mobile
