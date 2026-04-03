# Software Requirement Specification (SRS)

## Chức năng: Quản lý thông tin tài khoản (User Profile Management)
 
**Mã chức năng:** USER-01  
**Trạng thái:** In Progress  
**Người soạn thảo:** Phạm Thị Phượng  
 
---

### 1. Mô tả tổng quan (Description)
Chức năng cho phép người dùng (Khách hàng) xem và cập nhật thông tin cá nhân của mình. Hệ thống hỗ trợ cập nhật các thông tin cơ bản và ảnh đại diện (Avatar) để cá nhân hóa tài khoản.

---

### 2. Luồng nghiệp vụ (User Workflow)

| Bước | Hành động người dùng                      | Phản hồi hệ thống                                 |
|------|-------------------------------------------|---------------------------------------------------|
| 1    | Truy cập trang `Tài Khoản Của Tôi`        | Hiển thị Form chứa dữ liệu hiện tại từ Database   |
| 2    | Thay đổi thông tin cá nhân                | Kiểm tra tính hợp lệ của dữ liệu (Validation)     |
| 3    | Tải lên ảnh đại diện (Tùy chọn)           | Hiển thị Preview ảnh ngay trên giao diện          |
| 4    | Nhấn nút "Lưu thay đổi"                   | Gửi Request PUT/POST `/api/user/profile`          |
| 5    | Dữ liệu hợp lệ                            | Cập nhật DB, hiển thị Toast thành công            |
| 6    | Dữ liệu trùng lặp (SĐT)                   | Hiển thị thông báo lỗi tại trường tương ứng       |

---

### 3. Yêu cầu dữ liệu chi tiết (Detailed Data Requirements)
 
#### 3.1 Input Validation
- **Họ và tên:** * Kiểu: String.
  * Ràng buộc: Bắt buộc, tối đa 255 ký tự.
- **Email:** * Kiểu: String.
  * Ràng buộc: Email phải đúng định dạng
- **Số điện thoại:** * Kiểu: String.
  * Ràng buộc: Bắt buộc, 10 ký tự số, phải là duy nhất (UNIQUE).
- **Địa chỉ:** * Kiểu: String/Text.
  * Ràng buộc: **Không bắt buộc**
- **Ảnh đại diện (Avatar):** * Kiểu: File (Image).
  * Ràng buộc: Không bắt buộc. Định dạng: .jpg, .png. Dung lượng < 2MB.

#### 3.2 Database Logic (Table: users)
- `full_name`: Ghi đè giá trị mới.
- `phone_number`: Kiểm tra UNIQUE (không trùng với người dùng khác).
- `address`: Lưu thông tin địa chỉ liên lạc/giao hàng.
- `avatar_url`: Lưu đường dẫn file ảnh sau khi upload.
- `updated_at`: Cập nhật timestamp hiện tại.
 
---

### 4. Ràng buộc & Bảo mật (Constraints & Security)

- **Access Control:** Yêu cầu Header `Authorization: Bearer <JWT_TOKEN>`. Người dùng chỉ được sửa thông tin của chính mình.
- **File Security:** Backend thực hiện kiểm tra loại tệp (Extension/MIME type) để tránh upload mã độc.
- **Data Integrity:** Không cho phép để trống các trường bắt buộc đã quy định.

---

### 5. Danh mục lỗi (Error Handling)

| Mã lỗi | Trường hợp                      | Thông báo hiển thị                                |
|--------|---------------------------------|---------------------------------------------------|
| ERR_02 | SĐT đã tồn tại                  | "Số điện thoại này đã được sử dụng."             |
| ERR_04 | Format Phone sai                | "Số điện thoại phải có đúng 10 chữ số."     |
| ERR_06 | File quá lớn                    | "File ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB."                   |
| ERR_07 | Định dạng file không hỗ trợ     | hỉ chấp nhận ảnh định dạng PNG hoặc JPG!       |

---

### 6. Giao diện (UI/UX Specification)
- **Avatar:** Hiển thị trong khung tròn. Có icon hình camera đè ảnh cũ trong trường hợp người dùng hover vào avatar để thay đổi ảnh.
- **Responsive:** Form phải hiển thị tốt trên cả giao diện Mobile và Desktop.

---

### 7. API Reference (Dự kiến)
- **Endpoint:** `PUT /api/users/profile`
- **Content-Type:** `multipart/form-data` (để hỗ trợ gửi file ảnh).
### 8. Diagram Sequence
<img width="507" height="594" alt="Screenshot 2026-04-03 at 12 01 07" src="https://github.com/user-attachments/assets/a6fea5cf-f656-4928-acfd-fea5732241e6" />
