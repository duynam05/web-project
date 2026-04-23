# Software Requirement Specification (SRS)

## Chức năng: Quản lý giỏ hàng (Cart Management)

**Mã chức năng:** CART-01  
**Trạng thái:** Implemented  
**Người soạn thảo:** Phạm Thị Phượng
---

## 1. Mô tả tổng quan (Description)

Chức năng giỏ hàng cho phép người dùng đã đăng nhập quản lý danh sách sản phẩm muốn mua trong hệ thống thương mại điện tử.

Hệ thống hỗ trợ:
- Thêm sản phẩm vào giỏ hàng
- Cập nhật số lượng sản phẩm
- Xóa một sản phẩm khỏi giỏ hàng
- Xóa toàn bộ giỏ hàng
- Xem giỏ hàng hiện tại

Mỗi người dùng sở hữu một giỏ hàng riêng biệt dựa trên email (authentication principal).

---

## 2. Luồng nghiệp vụ (User Workflow)

### 2.1 Luồng thêm sản phẩm vào giỏ hàng

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Chọn sản phẩm (Book) | Hiển thị chi tiết sản phẩm |
| 2 | Nhập số lượng | Validate quantity |
| 3 | Nhấn "Thêm vào giỏ" | Gọi `POST /cart` |
| 4 | Hệ thống xử lý | Kiểm tra tồn kho + user |
| 5 | Thành công | Trả về `CartResponse` |

---

### 2.2 Luồng cập nhật số lượng

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Chọn sản phẩm trong giỏ | Hiển thị giỏ hàng |
| 2 | Thay đổi số lượng | Validate quantity |
| 3 | Nhấn cập nhật | `PUT /cart/{id}` |
| 4 | Hệ thống kiểm tra tồn kho | Validate stock |
| 5 | Thành công | Trả về giỏ hàng mới |

---

### 2.3 Luồng xóa sản phẩm

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Chọn item trong giỏ | Hiển thị giỏ hàng |
| 2 | Nhấn xóa | `DELETE /cart/{id}` |
| 3 | Hệ thống xử lý | Xóa item theo user |
| 4 | Thành công | Trả về CartResponse |

---

### 2.4 Luồng xóa toàn bộ giỏ hàng

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Nhấn "Xóa giỏ hàng" | `DELETE /cart/clear` |
| 2 | Hệ thống xử lý | Xóa toàn bộ item theo email |
| 3 | Thành công | Trả về giỏ hàng rỗng |

---

## 3. Yêu cầu dữ liệu chi tiết (Detailed Data Requirements)

### 3.1 Cart Request (Thêm vào giỏ hàng)

#### bookId
- Kiểu: UUID  
- Bắt buộc  
- Đại diện cho sản phẩm (Book)

#### quantity
- Kiểu: Integer  
- Bắt buộc  
- Điều kiện: ≥ 1  

---

### 3.2 Cart Item Response

- `id`: UUID của cart item  
- `bookId`: UUID sản phẩm  
- `title`: tên sách  
- `image`: ảnh sản phẩm  
- `unitPrice`: giá đơn vị  
- `quantity`: số lượng  
- `lineTotal`: tổng tiền từng item  
- `availableStock`: số lượng tồn kho  

---

### 3.3 Cart Response

- `items`: danh sách sản phẩm trong giỏ  
- `totalItems`: số loại sản phẩm  
- `totalQuantity`: tổng số lượng sản phẩm  
- `totalPrice`: tổng giá trị giỏ hàng  

---

## 4. Logic nghiệp vụ (Business Logic)

### 4.1 Thêm vào giỏ hàng

- Nếu sản phẩm đã tồn tại trong giỏ:
  - Cộng dồn số lượng
- Nếu chưa tồn tại:
  - Tạo mới cart item

---

### 4.2 Kiểm tra tồn kho

- quantity phải > 0
- quantity không được vượt quá stock
- Nếu vượt stock → lỗi `OUT_OF_STOCK`

---

### 4.3 Xóa item

- Xóa theo `cartItemId + userEmail`
- Nếu không tồn tại → `CART_ITEM_NOT_FOUND`

---

### 4.4 Xóa toàn bộ giỏ

- Xóa tất cả item theo userEmail

---

## 5. Database Logic

### CartItem Table

- `id` (UUID) – khóa chính  
- `user_id` – người dùng  
- `book_id` – sản phẩm  
- `title` – tên sách snapshot  
- `image` – ảnh snapshot  
- `price` – giá tại thời điểm thêm  
- `quantity` – số lượng  
- `created_at` – thời gian tạo  

---

## 6. API Reference

### 6.1 Xem giỏ hàng

<img width="972" height="777" alt="Screenshot 2026-04-23 at 22 15 30" src="https://github.com/user-attachments/assets/de0d1b4b-3f11-47c0-b89e-3b9cbac8b349" />

### 6.2 Thêm vào giỏ hàng

<img width="972" height="778" alt="Screenshot 2026-04-23 at 22 16 10" src="https://github.com/user-attachments/assets/2a11392a-205b-429e-81b5-95089f1629f5" />

### 6.3 Cập nhật số lượng

### 6.4 Xóa sản phẩm

### 6.5 Xoá toàn bộ giỏ hàng

<img width="973" height="614" alt="Screenshot 2026-04-23 at 22 17 40" src="https://github.com/user-attachments/assets/a7d73cd5-deca-46ec-b37f-4f9a3797ea84" />

## 7. Ràng buộc & Bảo mật (Constraints & Security)

Authorization
|Role |	Quyền |
|-----|-------|
|USER |	Quản lý giỏ hàng cá nhân
|ADMIN | Không áp dụng trực tiếp

