# Software Requirement Specification (SRS)

## Chức năng: Đăng ký tài khoản (User Registration)
 
**Mã chức năng:** AUTH-02  
**Trạng thái:** In Progress  
**Người soạn thảo:** Phạm Thị Phượng
 
---

### 1. Mô tả tổng quan (Description)
Chức năng cho phép người dùng mới tạo tài khoản "Khách hàng" để mua sắm. 
Sau khi hoàn tất đăng ký thành công, hệ thống sẽ tự động đăng nhập và 
điều hướng người dùng về trang chủ (Homepage) mà không cần xác thực email/OTP.

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
  * Ràng buộc: Bắt buộc, tối đa 255 ký tự. Không chứa ký tự đặc biệt số (tùy chọn).
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

- **Auto-Login:** Sau khi lưu DB thành công, Server trả về Token (JWT) để Client lưu vào Cookie/LocalStorage.
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

- **Cấu trúc:** Một cột dọc (Single Column) trên mobile, hai cột trên desktop (tùy thiết kế).
- **Trạng thái nút:** Nút "Đăng ký" sẽ ở trạng thái `disabled` nếu các trường bắt buộc chưa được điền.
- **Tiện ích:** Có icon "Con mắt" để ẩn/hiện mật khẩu ở cả 2 ô Password.
- **Thông báo:** Sử dụng Toast message xanh cho thành công và chữ đỏ dưới chân input cho lỗi validation.
