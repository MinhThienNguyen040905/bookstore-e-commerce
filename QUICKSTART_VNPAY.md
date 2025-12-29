# ⚡ QUICKSTART - VNPay Integration

Hướng dẫn nhanh để khởi động và test VNPay payment trong 5 phút!

## 🚀 Bước 1: Cấu hình Environment Variables

Tạo/cập nhật file `backend/.env`:

```env
# Database (giữ nguyên config hiện tại)
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost

# VNPay Sandbox Credentials (QUAN TRỌNG!)
VNP_TMNCODE=TCAHIH99
VNP_HASHSECRET=U7UH60FWH6D7YWARUURCLYPS4LTTCK82

# Server & Client URLs
PORT=3000
CLIENT_URL=http://localhost:5173

# Các config khác (JWT, Email, Cloudinary...)
```

## 📦 Bước 2: Cài đặt Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

**Lưu ý**: Dependencies `moment` và `qs` đã được cài đặt sẵn!

## 🗄️ Bước 3: Chạy Migration

```bash
cd backend
npx sequelize-cli db:migrate
```

Migration sẽ thêm 2 trường mới vào bảng `Orders`:
- `payment_status` (VARCHAR)
- `vnpay_transaction_no` (VARCHAR)

## 🏃 Bước 4: Khởi động Server

### Backend
```bash
cd backend
npm run dev
```

Server sẽ chạy ở: `http://localhost:3000`

### Frontend
```bash
cd frontend
npm run dev
```

Frontend sẽ chạy ở: `http://localhost:5173`

## 🧪 Bước 5: Test Payment Flow

### Chuẩn bị
1. Đăng nhập vào hệ thống
2. Thêm sách vào giỏ hàng
3. Vào trang `/cart`

### Checkout với VNPay
1. Click "Proceed to Checkout"
2. Nhập địa chỉ và số điện thoại
3. Chọn phương thức thanh toán: **"Credit Card / Debit Card"**
4. Click "Place Order"
5. Hệ thống sẽ redirect đến VNPay

### Thanh toán trên VNPay Sandbox
6. Chọn ngân hàng: **NCB**
7. Nhập thông tin:
   - Số thẻ: `9704198526191432198`
   - Tên: `NGUYEN VAN A`
   - Ngày: `07/15`
8. Click "Thanh toán"
9. Nhập OTP: `123456`
10. Click "Tiếp tục"

### Kết quả
- ✅ **Thành công**: Redirect về `/order-success`
- ❌ **Thất bại**: Redirect về `/order-failure`

## 🔍 Kiểm tra kết quả

### Backend Logs
Xem terminal backend để thấy:
```
Đơn hàng được tạo với payment_status: pending
VNPay callback nhận được với responseCode: 00
Order status cập nhật thành: paid
```

### Database
```sql
SELECT order_id, payment_status, vnpay_transaction_no, status 
FROM Orders 
WHERE order_id = [your_order_id];
```

Kết quả mong đợi:
```
payment_status: 'paid'
status: 'processing'
vnpay_transaction_no: '14594326'
```

### Frontend
- Trang Order Success hiển thị thông tin đơn hàng
- Cart đã được xóa
- Email xác nhận được gửi (nếu có cấu hình email)

## 🎯 Test Cases

### 1. Thanh toán thành công ✅
- Làm theo flow trên
- Kỳ vọng: Order status = 'processing', payment_status = 'paid'

### 2. Hủy thanh toán ❌
- Ở bước 8, click "Hủy giao dịch"
- Kỳ vọng: Redirect về `/order-failure?code=24`
- Order status giữ nguyên, payment_status = 'pending'

### 3. Sai OTP ❌
- Nhập sai OTP 3 lần
- Kỳ vọng: Redirect về `/order-failure?code=13`

### 4. Thanh toán COD (không qua VNPay)
- Chọn payment method: "Cash on Delivery"
- Kỳ vọng: Tạo order thành công, redirect ngay đến `/order-success`
- Không qua VNPay

## 🐛 Troubleshooting

### Lỗi: "module is not defined"
**Giải pháp**: Migration file phải có extension `.cjs`, không phải `.js`

### Lỗi: "Invalid signature"
**Giải pháp**: Kiểm tra `VNP_HASHSECRET` trong .env, phải đúng `U7UH60FWH6D7YWARUURCLYPS4LTTCK82`

### Lỗi: "Cannot find path"
**Giải pháp**: Đảm bảo chạy lệnh từ đúng thư mục (backend/ hoặc root)

### Server không khởi động được
**Giải pháp**: 
- Kiểm tra port 3000 đã được sử dụng chưa
- Kiểm tra database connection
- Xem logs để biết lỗi cụ thể

### VNPay không redirect về
**Giải pháp**: 
- Kiểm tra `vnp_ReturnUrl` trong `backend/config/vnpay.js`
- Đảm bảo backend đang chạy ở port 3000

## 📚 Tài liệu tham khảo

- **VNPAY_SETUP.md** - Thông tin chi tiết về VNPay configuration
- **VNPAY_INTEGRATION_GUIDE.md** - Hướng dẫn tích hợp chi tiết cho developer
- **PHAN_TICH_DU_AN.md** - Phân tích tổng quan dự án

## ✅ Checklist hoàn thành

- [x] Cài đặt dependencies (moment, qs)
- [x] Tạo VNPay config file
- [x] Tạo Payment controller và routes
- [x] Mount payment routes vào server
- [x] Chạy migration
- [x] Cập nhật Order model
- [x] Tạo Payment API client (frontend)
- [x] Tạo VNPay payment hook (frontend)
- [x] Cập nhật PaymentPage với VNPay integration
- [x] Tạo OrderFailurePage
- [x] Thêm route cho order-failure
- [x] Implement Verified Reviews logic
- [x] Tạo documentation

## 🎉 Hoàn tất!

Bây giờ bạn có thể test thanh toán VNPay trong dự án!

**Lưu ý**: Đây là môi trường Sandbox. Khi deploy production, cần cập nhật credentials và URLs.

---

**Chúc bạn test thành công! 🚀**

