# Software Requirement Specification (SRS)

## Chức năng: Quản lý sách (Book Management)

**Mã chức năng:** BOOK-01  
**Trạng thái:** Updated  
**Người soạn thảo:** Phạm Thị Phượng

---

## 1. Mô tả tổng quan (Description)

Chức năng cho phép hệ thống quản lý thông tin sách phục vụ cho việc mua bán và hiển thị danh mục sản phẩm.

Hệ thống hỗ trợ:
- Xem danh sách sách (Public)
- Xem chi tiết sách (nếu mở rộng API)
- Thêm sách mới (Authenticated user / ADMIN theo role hệ thống)

Hiện tại, Books API được thiết kế chủ yếu phục vụ hiển thị danh mục sản phẩm và tạo dữ liệu quản trị.

---

## 2. Luồng nghiệp vụ (User Workflow)

### 2.1 Luồng người dùng (USER)

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Truy cập danh sách sách | Gọi `GET /books` |
| 2 | Xem danh sách sách | Trả về dữ liệu phân trang |
| 3 | Chọn sách (nếu có UI chi tiết) | Gọi `GET /books/{id}` |
| 4 | Xem thông tin sách | Hiển thị chi tiết |

---

### 2.2 Luồng quản trị (ADMIN / AUTHENTICATED USER)

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Đăng nhập hệ thống | `POST /auth/token` |
| 2 | Nhận JWT token | Trả về access token |
| 3 | Tạo sách mới | `POST /books` |
| 4 | Hệ thống kiểm tra quyền | Validate JWT + Role |
| 5 | Lưu dữ liệu | Persist vào database |
| 6 | Trả kết quả | Trả về Book object |

---

## 3. Yêu cầu dữ liệu chi tiết (Detailed Data Requirements)

### 3.1 Input Validation

#### Title
- Kiểu: String  
- Bắt buộc  
- Tối đa: 255 ký tự  

#### Author
- Kiểu: String  
- Bắt buộc  

#### Category
- Kiểu: String  
- Bắt buộc  

#### Description
- Kiểu: Text  
- Không bắt buộc  

#### Price
- Kiểu: Number  
- Điều kiện: ≥ 0  

---

### 3.2 Database Schema (Table: books)

- `id` (UUID) – Khóa chính  
- `title` – Tên sách  
- `author` – Tác giả  
- `category` – Thể loại  
- `description` – Mô tả sách  
- `price` – Giá sách  
- `created_at` – Thời gian tạo  
- `updated_at` – Thời gian cập nhật  

---

## 4. API Reference

### 4.1 Public API

#### GET /books
- Mô tả: Lấy danh sách sách
- Auth: Public
- Query params:
  - `q` (optional): từ khóa tìm kiếm
  - `category` (optional): lọc theo thể loại
  - `sort` (default: popular)
  - `page` (default: 0)
  - `size` (default: 12)

---

### 4.2 Protected API

#### POST /books
- Mô tả: Tạo sách mới
- Auth: Bearer Token (Authenticated user / ADMIN)
- Body:
{
  "title": "P1",
    "author": "PP",
    "category": "Test1",
    "price": 90000,
    "rating": 4.7,
    "stock": 5,
    "image": "https://link_anh"
}
- JSON:
{
    "id": "UUID",
    "title": "P1",
    "author": "PP",
    "category": "Test1",
    "price": 90000,
    "rating": 4.7,
    "stock": 5,
    "image": "https://link_anh"
}
<img width="971" height="737" alt="Screenshot 2026-04-23 at 21 10 17" src="https://github.com/user-attachments/assets/84ac4136-1e6e-4376-b0b2-530dbc53bfbd" />
#### GET /books
- Mô tả: Lấy danh sách sách
- Auth: Public
<img width="970" height="776" alt="Screenshot 2026-04-23 at 21 53 42" src="https://github.com/user-attachments/assets/ab761f91-cefc-4f90-8dc2-89bfb55b1ab2" />
