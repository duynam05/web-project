# Software Requirement Specification (SRS)

## Chức năng: Đăng ký tài khoản (User Registration)
 
**Mã chức năng:** AUTH-02  
**Trạng thái:** In Progress  
**Người soạn thảo:** Phạm Thị Phượng
 
---

### 1. Mô tả tổng quan (Description)
Chức năng cho phép người dùng mới tạo tài khoản "Khách hàng" để mua sắm. 
Sau khi hoàn tất đăng ký thành công, hệ thống sẽ chuyển hướng về trang đăng nhập và 
cho phép người dùng đăng nhập bằng tài khoản vừa tạo thành công để truy cập vào trang chủ (Homepage) mà không cần xác thực email/OTP.

---

### 2. Luồng nghiệp vụ (User Workflow)

| Bước | Hành động người dùng             | Phản hồi hệ thống                                   |
|------|----------------------------------|---------------------------------------------------|
| 1    | Truy cập trang `/register`       | Hiển thị Form đăng ký rỗng                        |
| 2    | Nhập đầy đủ 5 trường thông tin   | Kiểm tra Validation tại client (Real-time)        |
| 3    | Nhấn nút "Đăng ký"               | Gửi Request POST `/api/auth/register`             |
| 4    | Dữ liệu hợp lệ                   | Tạo User, khởi tạo Session/Token, chuyển về `/`   |
| 5    | Email hoặc SĐT đã tồn tại        | Hiển thị thông báo lỗi tại trường tương ứng       |

---

### 3. Yêu cầu dữ liệu chi tiết (Detailed Data Requirements)
 
#### 3.1 Input Validation
- **Họ và tên:** 
  * Kiểu: String.
  * Ràng buộc: Bắt buộc, tối đa 255 ký tự.
- **Email:** 
 * Kiểu: String.
 * Ràng buộc: Bắt buộc, đúng định dạng `Regex: ^[^\s@]+@[^\s@]+\.[^\s@]+$`.
- **Số điện thoại:** 
 * Kiểu: String.
 * Ràng buộc: Bắt buộc, độ dài chính xác 10 ký tự, chỉ chứa số (0-9).
- **Mật khẩu:** 
 * Kiểu: String.
 * Ràng buộc: Bắt buộc, tối thiểu 6 ký tự.
- **Nhập lại mật khẩu:** 
 * Kiểu: String.
 * Ràng buộc: Phải trùng khớp 100% với chuỗi ký tự trong ô "Mật khẩu".

#### 3.2 Database Logic (Table: users)
- `full_name`: Lưu giá trị nhập từ form.
- `email`: Lưu giá trị (đảm bảo thuộc tính UNIQUE).
- `phone_number`: Lưu giá trị (đảm bảo thuộc tính UNIQUE).
- `password`: Lưu chuỗi đã mã hóa (Bcrypt/Argon2).
- `role`: Mặc định gán giá trị "Customer".
- `status`: Mặc định "Active".
 
---

### 4. Ràng buộc & Bảo mật (Constraints & Security)

- **Điều hướng sau thành công:** Hệ thống không tự tạo session ngay. Sau khi lưu DB, Server phản hồi mã thành công (201 Created), Client thực hiện window.location.href = '/login'.
- **Password Security:** Tuyệt đối không lưu mật khẩu thô.
- **XSS/Injection:** Thực hiện sanitize đầu vào để chống SQL Injection và XSS.
- **Rate Limiting:** Giới hạn tối đa 10 lần đăng ký thử trên 1 địa chỉ IP trong 1 giờ để chống bot.

---

### 5. Danh mục lỗi (Error Handling)

| Mã lỗi | Trường hợp                      | Thông báo hiển thị                                |
|--------|---------------------------------|---------------------------------------------------|
| ERR_01 | Email đã được đăng ký           | "Email này đã tồn tại trong hệ thống."           |
| ERR_02 | SĐT đã được đăng ký             | "Số điện thoại này đã được sử dụng."             |
| ERR_03 | Password mismatch               | "Mật khẩu nhập lại không khớp."                  |
| ERR_04 | Format Phone sai                | "Số điện thoại phải bao gồm đúng 10 chữ số."     |
| ERR_05 | Name > 255 chars                | "Họ tên quá dài (tối đa 255 ký tự)."             |

---

### 6. Giao diện (UI/UX Specification)
 **Thông báo: Sau khi đăng ký thành công, trang Đăng nhập nên hiển thị một Toast/Alert thông báo: "Tài khoản đã được tạo thành công! Vui lòng đăng nhập để bắt đầu."
- **Tiện ích:** Có icon "Con mắt" để ẩn/hiện mật khẩu ở cả 2 ô Password.
- **Thông báo:** Sử dụng Toast message chữ đỏ dưới chân input cho lỗi validation.
### 7. Diagram Sequence
<img width="692" height="632" alt="Screenshot 2026-03-27 at 01 03 25" src="https://github.com/user-attachments/assets/241d5297-9bb1-426d-be2b-e8e6fc816955" />

