# 🚀 HƯỚNG DẪN THIẾT LẬP VNPAY SANDBOX

## 📋 Thông tin VNPay Sandbox đã cấu hình

Dự án đã được cấu hình với thông tin VNPay Sandbox như sau:

- **vnp_TmnCode**: `TCAHIH99`
- **vnp_HashSecret**: `U7UH60FWH6D7YWARUURCLYPS4LTTCK82`
- **vnp_Url**: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`
- **vnp_ReturnUrl**: `http://localhost:3000/api/payment/vnpay_return`

## 🔧 Bước 1: Cấu hình Environment Variables

Thêm các biến sau vào file `.env` trong thư mục `backend/`:

```env
# VNPay Configuration (Sandbox)
VNP_TMNCODE=TCAHIH99
VNP_HASHSECRET=U7UH60FWH6D7YWARUURCLYPS4LTTCK82
```

## 📦 Bước 2: Cài đặt Dependencies (ĐÃ HOÀN THÀNH)

Các package cần thiết đã được cài đặt:
- ✅ `moment` - Xử lý thời gian
- ✅ `qs` - Query string parsing
- ✅ `crypto` - Tạo chữ ký HMAC SHA512

## 🗄️ Bước 3: Chạy Migration (ĐÃ HOÀN THÀNH)

Migration đã được chạy để thêm các trường sau vào bảng `Orders`:
- ✅ `payment_status` - Trạng thái thanh toán (pending/paid/failed)
- ✅ `vnpay_transaction_no` - Mã giao dịch VNPay

## 🔑 Bước 4: API Endpoints

### 1. Tạo URL thanh toán VNPay

**POST** `/api/payment/create_payment_url`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": 123,
  "amount": 500000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo URL thanh toán thành công",
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
  }
}
```

### 2. VNPay Return Callback

**GET** `/api/payment/vnpay_return`

Endpoint này sẽ được VNPay gọi sau khi thanh toán. Nó sẽ:
- Verify chữ ký từ VNPay
- Cập nhật trạng thái đơn hàng
- Xóa giỏ hàng nếu thanh toán thành công
- Redirect về frontend:
  - **Thành công**: `http://localhost:5173/order-success?code=00&orderId=...&transactionNo=...`
  - **Thất bại**: `http://localhost:5173/order-failure?code=...&orderId=...`

## 🧪 Bước 5: Thông tin Test Card

Sử dụng thông tin sau để test thanh toán trên VNPay Sandbox:

- **Ngân hàng**: NCB
- **Số thẻ**: `9704198526191432198`
- **Tên chủ thẻ**: `NGUYEN VAN A`
- **Ngày phát hành**: `07/15`
- **Mã OTP**: `123456`

## 📝 Bước 6: Flow thanh toán

1. User tạo đơn hàng → Nhận `orderId`
2. Frontend gọi API `/api/payment/create_payment_url` với `orderId` và `amount`
3. Backend trả về `paymentUrl`
4. Frontend redirect user đến `paymentUrl` (VNPay)
5. User nhập thông tin thẻ và xác nhận thanh toán
6. VNPay redirect về `/api/payment/vnpay_return`
7. Backend xử lý kết quả và redirect về frontend
8. Frontend hiển thị kết quả thanh toán

## ✅ Verified Reviews Logic (ĐÃ CẬP NHẬT)

Review controller đã được cập nhật để chỉ cho phép đánh giá sách khi:
- Đơn hàng chứa sách đó có trạng thái `delivered`
- User chỉ có thể review sách mà họ đã mua và nhận hàng

## 🔒 Security Notes

- Chữ ký HMAC SHA512 được sử dụng để verify tính toàn vẹn của dữ liệu
- Tất cả params phải được sort theo alphabet trước khi sign
- vnp_SecureHash được append vào URL sau khi sign
- Callback từ VNPay phải verify chữ ký trước khi xử lý

## 🚀 Bước 7: Khởi động Server

```bash
cd backend
npm run dev
```

Server sẽ chạy ở `http://localhost:3000`

## 📚 Response Codes từ VNPay

| Code | Mô tả |
|------|-------|
| 00   | Giao dịch thành công |
| 07   | Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường). |
| 09   | Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng. |
| 10   | Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần |
| 11   | Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch. |
| 12   | Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa. |
| 13   | Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). |
| 24   | Giao dịch không thành công do: Khách hàng hủy giao dịch |
| 51   | Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch. |
| 65   | Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày. |
| 75   | Ngân hàng thanh toán đang bảo trì. |
| 79   | Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. |
| 99   | Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê) |

## 📞 Support

Nếu có vấn đề, vui lòng kiểm tra:
1. Environment variables đã được thiết lập đúng
2. Migration đã chạy thành công
3. Server đang chạy ở port 3000
4. Frontend đang chạy ở port 5173

---

**Trạng thái**: ✅ **ĐÃ HOÀN THÀNH VÀ SẴN SÀNG SỬ DỤNG**

