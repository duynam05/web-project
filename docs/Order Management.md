# Software Requirement Specification (SRS)

## Chức năng: Đặt hàng và quản lý đơn hàng (Order Management)

**Mã chức năng:** ORDER-01  
**Trạng thái:** Implemented  
**Người soạn thảo:** Phạm Thị Phượng

---

## 1. Mô tả tổng quan (Description)

Chức năng đặt hàng cho phép người dùng tạo đơn hàng từ giỏ hàng hiện tại và theo dõi trạng thái đơn hàng trong hệ thống.

Hệ thống hỗ trợ:
- Tạo đơn hàng từ giỏ hàng
- Xem danh sách đơn hàng của người dùng
- Xem chi tiết đơn hàng
- Thanh toán đơn hàng (COD / ONLINE)
- Hủy đơn hàng (theo điều kiện)
- Admin quản lý toàn bộ đơn hàng
- Admin cập nhật trạng thái đơn hàng

---

## 2. Luồng nghiệp vụ (User Workflow)

### 2.1 Luồng tạo đơn hàng

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Xem giỏ hàng | Lấy dữ liệu từ cart |
| 2 | Nhập thông tin giao hàng | phone, address, location |
| 3 | Chọn phương thức thanh toán | COD / ONLINE |
| 4 | Nhấn "Đặt hàng" | `POST /api/orders` |
| 5 | Hệ thống kiểm tra giỏ hàng | Validate stock + cart |
| 6 | Tạo đơn hàng | Trừ tồn kho + tạo order |
| 7 | Xóa giỏ hàng | Cart được clear |

---

### 2.2 Luồng xem danh sách đơn hàng (User)

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Truy cập "Đơn hàng của tôi" | `GET /api/orders` |
| 2 | Hệ thống xử lý | Lấy order theo email |
| 3 | Hiển thị danh sách | Trả về `List<OrderResponse>` |

---

### 2.3 Luồng xem chi tiết đơn hàng

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Chọn đơn hàng | Click orderId |
| 2 | Gọi API | `GET /api/orders/{orderId}` |
| 3 | Hệ thống kiểm tra quyền | User chỉ xem đơn của mình |
| 4 | Trả về chi tiết | OrderResponse |

---

### 2.4 Luồng thanh toán đơn hàng

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Chọn "Thanh toán" | Order đang PENDING |
| 2 | Gọi API | `POST /api/orders/{orderId}/payment` |
| 3 | Kiểm tra trạng thái | Không được thanh toán lại |
| 4 | Cập nhật payment | PAID + reference |
| 5 | Cập nhật order | CONFIRMED nếu hợp lệ |

---

### 2.5 Luồng hủy đơn hàng

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|-------------------|
| 1 | Chọn "Hủy đơn" | Order hợp lệ |
| 2 | Gọi API | `POST /api/orders/{orderId}/cancel` |
| 3 | Kiểm tra trạng thái | Chỉ PENDING / CONFIRMED |
| 4 | Hoàn kho | Trả lại stock |
| 5 | Cập nhật trạng thái | CANCELLED |

---

## 3. Luồng quản trị (Admin Workflow)

### 3.1 Quản lý đơn hàng

| Bước | ADMIN | API |
|------|------|-----|
| 1 | Xem tất cả đơn hàng | `GET /api/orders/admin` |
| 2 | Xem chi tiết đơn | `GET /api/orders/admin/{orderId}` |
| 3 | Cập nhật trạng thái | `PATCH /api/orders/admin/{orderId}/status` |

---

## 4. Yêu cầu dữ liệu chi tiết (Detailed Data Requirements)

### 4.1 Order Request

#### phone
- Kiểu: String  
- Bắt buộc  
- Số điện thoại người nhận  

#### address
- Kiểu: String  
- Bắt buộc  
- Địa chỉ giao hàng  

#### latitude / longitude
- Kiểu: Double  
- Không bắt buộc  
- Dùng cho định vị giao hàng  

#### paymentMethod
- Kiểu: String  
- Giá trị: `COD`, `ONLINE`  

---

### 4.2 Payment Request

- `paymentMethod`: COD / ONLINE  

---

### 4.3 Order Status Update

- `status`:
  - PENDING
  - PENDING_PAYMENT
  - CONFIRMED
  - SHIPPING
  - COMPLETED
  - CANCELLED  

---

## 5. Database Logic

### Orders Table

- `id` (UUID)  
- `user_id`  
- `phone`  
- `address`  
- `latitude` / `longitude`  
- `status`  
- `payment_method`  
- `payment_status`  
- `total_price`  
- `payment_reference`  
- `created_at`  
- `paid_at`  

---

### OrderItems Table

- `id`  
- `order_id`  
- `book_id`  
- `title`  
- `image`  
- `price`  
- `quantity`  

---

## 6. API Reference

### 6.1 Tạo đơn hàng

<img width="973" height="776" alt="Screenshot 2026-04-23 at 22 33 41" src="https://github.com/user-attachments/assets/a3bf3b4a-02dd-471c-936a-fdf921262a03" />

### 6.2 Xem đơn hàng của tôi

<img width="969" height="779" alt="Screenshot 2026-04-23 at 22 34 53" src="https://github.com/user-attachments/assets/d624669f-ebbd-4dd8-a4c3-a59802246a9c" />

### 6.3 Xem chi tiết đơn hàng

<img width="975" height="777" alt="Screenshot 2026-04-23 at 22 35 29" src="https://github.com/user-attachments/assets/5f7689e0-7c98-439d-af6c-63bf43067d84" />

### 6.4 Thanh toán đơn hàng

<img width="972" height="775" alt="Screenshot 2026-04-23 at 22 36 37" src="https://github.com/user-attachments/assets/4fe46835-7879-4a53-838f-47ce5ef19cfe" />


### 6.5 Hủy đơn hàng

### 6.6 Admin APIs
| Method |	Endpoint |	Mô tả |
|--------|-----------|--------|
|GET |	/api/orders/admin |	Danh sách tất cả đơn |
|GET |	/api/orders/admin/{orderId} |	Chi tiết đơn |
|PATCH |	/api/orders/admin/{orderId}/status |	Cập nhật trạng thái |
## 7. Ràng buộc & Bảo mật (Constraints & Security)
Authentication
Authorization: Bearer <JWT_TOKEN>
Authorization
|Role |	Quyền |
|-----|-------|
|USER |	Quản lý đơn hàng cá nhân |
|ADMIN |	Quản lý toàn bộ đơn hàng |
### Business Rules
- Không thể đặt hàng nếu giỏ hàng trống
- Khi tạo đơn:
- Trừ stock sản phẩm
- Xóa cart
- Không thể thanh toán lại đơn đã PAID
- Không thể hủy đơn khi:
- SHIPPING hoặc COMPLETED
- Admin có quyền thay đổi trạng thái hợp lệ theo luồng
