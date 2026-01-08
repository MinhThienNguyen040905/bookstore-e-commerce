# 📚 API Documentation - Bookstore E-commerce

## 🚀 Quick Start

### 1. Chạy Server

```bash
cd backend
npm install  # Nếu chưa install dependencies
npm run dev   # Hoặc npm start
```

Server sẽ chạy tại: `http://localhost:3000`

### 2. Import Postman Collection

1. Mở Postman
2. Click **Import** (góc trên bên trái)
3. Chọn file: `postman/collections/Bookstore_API.postman_collection.json`
4. Import Environment: `postman/environments/Local.postman_environment.json`
5. Chọn environment **"Local Development"** ở góc trên bên phải

### 3. Setup Environment Variables

Sau khi import, cập nhật các biến trong environment:

- `base_url`: `http://localhost:3000` (đã có sẵn)
- `access_token`: Lấy từ response của Login API
- `admin_access_token`: Lấy từ response của Login với tài khoản admin

---

## 📋 API Endpoints

### 🔐 Authentication

#### Login
```
POST /api/users/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "...",
    "user": { ... }
  }
}
```

#### Register (3 bước)

**Bước 1: Request OTP**
```
POST /api/users/request-otp
Body: { "email": "newuser@example.com" }
```

**Bước 2: Verify OTP**
```
POST /api/users/verify-otp
Body: { "email": "...", "otp": "123456" }
```

**Bước 3: Complete Registration**
```
POST /api/users/register
Body: {
  "email": "...",
  "otp": "...",
  "name": "John Doe",
  "password": "password123"
}
```

#### Refresh Token
```
POST /api/users/refresh-token
(Cookie: refreshToken tự động gửi)
```

#### Logout
```
POST /api/users/logout
Headers: Authorization: Bearer {access_token}
```

#### Reset Password
```
POST /api/users/reset-password
Body: { "email": "user@example.com" }
```

---

### 📚 Books

#### Get All Books
```
GET /api/books?title=&author=&genre=&min_price=&max_price=&sort=
```

#### Get Book By ID
```
GET /api/books/:id
```

#### Get New Releases
```
GET /api/books/new-releases
```

#### Get Top Rated Books
```
GET /api/books/top-rated
```

#### Create Book (Admin Only)
```
POST /api/books
Headers: Authorization: Bearer {admin_access_token}
Content-Type: multipart/form-data

Body:
- title: string (required)
- description: string
- publisher_id: number (required)
- stock: number (required, >= 0)
- price: number (required, > 0)
- isbn: string (required, unique)
- release_date: date
- authors: string (comma-separated IDs, e.g., "1,2")
- genres: string (comma-separated IDs, e.g., "1,2")
- cover_image: file (optional)
```

#### Update Book (Admin Only)
```
PUT /api/books/:id
Headers: Authorization: Bearer {admin_access_token}
Content-Type: multipart/form-data

Body: (tất cả fields đều optional)
- title: string
- description: string
- price: number (> 0)
- stock: number (>= 0, integer)
- publisher_id: number
- isbn: string
- release_date: date
- authors: string (comma-separated IDs)
- genres: string (comma-separated IDs)
- cover_image: file (nếu có sẽ thay ảnh cũ)
```

**Validation:**
- Price phải là số dương
- Stock phải là số nguyên không âm
- ID phải là số hợp lệ

#### Delete Book (Admin Only)
```
DELETE /api/books/:id
Headers: Authorization: Bearer {admin_access_token}
```

**Lưu ý:** Xóa sách sẽ tự động xóa:
- Reviews liên quan
- Cart items liên quan
- Ảnh trên Cloudinary

---

### 🛒 Cart

#### Get Cart
```
GET /api/cart
Headers: Authorization: Bearer {access_token}
```

#### Add to Cart
```
POST /api/cart
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

Body:
{
  "book_id": 1,
  "quantity": 2
}
```

#### Update Cart
```
PUT /api/cart
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

Body:
{
  "book_id": 1,
  "quantity": 5
}
```

#### Remove from Cart
```
DELETE /api/cart/:book_id
Headers: Authorization: Bearer {access_token}
```

---

### 📦 Orders

#### Create Order
```
POST /api/orders
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

Body:
{
  "promo_code": "DISCOUNT10",  // optional
  "payment_method": "cash_on_delivery",  // required: cash_on_delivery | paypal | credit_card
  "address": "123 Main St, City",  // required
  "phone": "0123456789"  // required
}
```

#### Get My Orders
```
GET /api/orders
Headers: Authorization: Bearer {access_token}
```

> 📌 **Lưu ý**: Nếu frontend cần timeline trạng thái cho từng đơn, dùng endpoint `GET /api/orders/my-orders` thay vì `GET /api/orders`.

#### Get My Orders (Timeline)
```
GET /api/orders/my-orders
Headers: Authorization: Bearer {access_token}
```

**Response đặc biệt**:
- `status_history`: mảng chuỗi bước (`processing` → `shipped` → `delivered`). Mỗi phần tử gồm:
  - `status`: trạng thái hiện tại.
  - `title`, `description`: nội dung hiển thị trên timeline.
  - `completedAt`: ngày ước tính/đã hoàn thành (dựa trên `order_date` + offset).
  - `isCompleted`: `true` nếu bước đã hoàn thành (bao gồm bước của `order.status` hiện tại).
- Nếu đơn đã hủy (`status = cancelled`), mảng chỉ chứa một bước hủy riêng (`title`: "Đơn hàng đã bị hủy").

Ví dụ:
```json
{
  "status_history": [
    {
      "status": "processing",
      "title": "Đang xử lý",
      "description": "Đơn hàng đang được xác nhận",
      "completedAt": "2025-12-20T05:00:00.000Z",
      "isCompleted": true
    },
    {
      "status": "shipped",
      "title": "Đang vận chuyển",
      "description": "Đơn hàng đang được giao",
      "completedAt": "2025-12-22T05:00:00.000Z",
      "isCompleted": true
    },
    {
      "status": "delivered",
      "title": "Đã giao hàng",
      "description": "Đơn hàng đã đến tay bạn",
      "completedAt": "2025-12-24T05:00:00.000Z",
      "isCompleted": false
    }
  ]
}
```

#### Get All Orders (Admin Only)
```
GET /api/orders/all
Headers: Authorization: Bearer {admin_access_token}
```

#### Update Order Status (Admin Only)
```
PUT /api/orders/:order_id/status
Headers: Authorization: Bearer {admin_access_token}
Content-Type: application/json

Body:
{
  "status": "shipped"  // processing | shipped | delivered | cancelled
}
```

---

### ⭐ Reviews

#### Add Review
```
POST /api/reviews
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

Body:
{
  "book_id": 1,
  "rating": 5,  // 1-5
  "comment": "Great book!"
}
```

#### Get Reviews by Book
```
GET /api/reviews/book/:book_id
```

#### Get All Reviews (Admin Only)
```
GET /api/reviews/all
Headers: Authorization: Bearer {admin_access_token}
```

---

### 🎟️ Promo Codes

#### Get All Promos
```
GET /api/promos
```

#### Check Promo Code
```
POST /api/promos/by-code
Content-Type: application/json

Body:
{
  "code": "DISCOUNT10",
  "total_price": 500000
}
```

#### Create Promo (Admin Only)
```
POST /api/promos
Headers: Authorization: Bearer {admin_access_token}
Content-Type: application/json

Body:
{
  "code": "DISCOUNT10",
  "discount_percent": 10,  // 0-100
  "min_amount": 100000,  // Số tiền tối thiểu
  "expiry_date": "2025-12-31"
}
```

#### Get All Promos (Admin Only)
```
GET /api/promos/all
Headers: Authorization: Bearer {admin_access_token}
```

---

### 👨‍💼 Admin

#### Get All Users (Admin Only)
```
GET /api/users
Headers: Authorization: Bearer {admin_access_token}
```

#### Get Dashboard Stats (Admin Only)
```
GET /api/admin/stats
Headers: Authorization: Bearer {admin_access_token}

Response:
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalOrders": 320,
    "totalRevenue": 45000000,
    "recentOrders": [
      {
        "order_id": 1,
        "total_price": 500000,
        "status": "delivered",
        "order_date": "...",
        "User": { ... },
        "OrderItems": [ ... ]
      }
    ]
  }
}
```

---

## 🔒 Authentication

Tất cả endpoints (trừ Login, Register, Public Books/Reviews) đều yêu cầu:

```
Headers:
  Authorization: Bearer {access_token}
```

**Lấy access_token:**
1. Gọi `POST /api/users/login`
2. Copy `accessToken` từ response
3. Paste vào environment variable `access_token` trong Postman

**Refresh token tự động:**
- Refresh token được lưu trong cookie (httpOnly, secure)
- Gọi `POST /api/users/refresh-token` để lấy access token mới

---

## ⚠️ Error Responses

Tất cả errors đều trả về format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (chưa đăng nhập hoặc token hết hạn)
- `403` - Forbidden (không có quyền admin)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📝 Notes

1. **File Upload**: Sử dụng `multipart/form-data` cho upload ảnh
2. **Validation**: 
   - Price phải > 0
   - Stock phải >= 0 và là số nguyên
   - ISBN phải unique
3. **Cascade Delete**: Xóa sách sẽ tự động xóa reviews và cart items
4. **Revenue Calculation**: Chỉ tính đơn hàng có status `delivered` hoặc `shipped`

---

## 🧪 Testing Tips

1. **Test với Postman Collection**: Đã có sẵn tất cả endpoints
2. **Environment Variables**: Dùng `{{base_url}}`, `{{access_token}}`, `{{admin_access_token}}`
3. **Test Flow**:
   - Login → Lấy token → Set vào environment
   - Test các endpoints theo thứ tự: Books → Cart → Orders
4. **Admin Endpoints**: Cần login với tài khoản có `role='admin'`

---

**Last Updated**: 2025-12-19






