# 📘 HƯỚNG DẪN TÍCH HỢP VNPAY - COMPLETE GUIDE

## 📋 Mục lục

1. [Quick Start - Bắt đầu nhanh](#-quick-start)
2. [Cấu hình và Setup](#-cấu-hình-và-setup)
3. [API Endpoints](#-api-endpoints)
4. [Flow thanh toán](#-flow-thanh-toán)
5. [Sử dụng trong Frontend](#-sử-dụng-trong-frontend)
6. [Testing](#-testing)
7. [Troubleshooting](#-troubleshooting)
8. [Security & Best Practices](#-security--best-practices)
9. [Deployment](#-deployment)

---

## ⚡ Quick Start

Hướng dẫn nhanh để khởi động và test VNPay payment trong 5 phút!

### Bước 1: Cấu hình Environment Variables

Tạo/cập nhật file `backend/.env`:

```env
# VNPay Sandbox Credentials (QUAN TRỌNG!)
VNP_TMNCODE=TCAHIH99
VNP_HASHSECRET=U7UH60FWH6D7YWARUURCLYPS4LTTCK82

# Server & Client URLs
PORT=3000
CLIENT_URL=http://localhost:5173
```

### Bước 2: Cài đặt Dependencies

```bash
cd backend
npm install
```

**Lưu ý**: Dependencies `moment` và `qs` đã được cài đặt sẵn!

### Bước 3: Chạy Migration

```bash
cd backend
npx sequelize-cli db:migrate
```

Migration sẽ thêm 2 trường mới vào bảng `Orders`:
- `payment_status` (VARCHAR) - Trạng thái thanh toán: pending, paid, failed
- `vnpay_transaction_no` (VARCHAR) - Mã giao dịch VNPay

### Bước 4: Khởi động Server

```bash
# Backend
cd backend
npm run dev
# Server chạy ở: http://localhost:3000

# Frontend (terminal khác)
cd frontend
npm run dev
# Frontend chạy ở: http://localhost:5173
```

### Bước 5: Test Payment Flow

1. Đăng nhập vào hệ thống
2. Thêm sách vào giỏ hàng
3. Vào trang `/cart` → Click "Proceed to Checkout"
4. Nhập địa chỉ và số điện thoại
5. Chọn phương thức thanh toán: **"Credit Card / Debit Card"**
6. Click "Place Order"
7. Hệ thống sẽ redirect đến VNPay

**Thanh toán trên VNPay Sandbox:**
- Chọn ngân hàng: **NCB**
- Số thẻ: `9704198526191432198`
- Tên: `NGUYEN VAN A`
- Ngày: `07/15`
- OTP: `123456`

**Kết quả:**
- ✅ **Thành công**: Redirect về `/order-success`
- ❌ **Thất bại**: Redirect về `/order-failure`

---

## 🔧 Cấu hình và Setup

### Thông tin VNPay Sandbox đã cấu hình

- **vnp_TmnCode**: `TCAHIH99`
- **vnp_HashSecret**: `U7UH60FWH6D7YWARUURCLYPS4LTTCK82`
- **vnp_Url**: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`
- **vnp_ReturnUrl**: `http://localhost:3000/api/payment/vnpay_return`

### Các file đã được tạo/cập nhật

**Backend:**
- `backend/config/vnpay.js` - Cấu hình VNPay credentials
- `backend/controllers/paymentController.js` - Controller xử lý payment logic
- `backend/routes/payment.js` - Routes cho VNPay endpoints
- `backend/server.js` - Mount payment routes (đã cập nhật)
- `backend/models/Order.js` - Thêm payment_status và vnpay_transaction_no
- `backend/migrations/20251229185446-add-vnpay-fields-to-orders.cjs` - Migration
- `backend/controllers/reviewController.js` - Verified Reviews logic (đã cập nhật)

**Frontend:**
- `frontend/src/api/paymentApi.ts` - API client cho VNPay
- `frontend/src/hooks/useVNPayPayment.ts` - React Hook cho VNPay payment
- `frontend/src/pages/OrderFailurePage.tsx` - Trang xử lý thanh toán thất bại
- `frontend/src/pages/PaymentPage.tsx` - Tích hợp VNPay vào checkout flow
- `frontend/src/routes/index.tsx` - Thêm route cho order-failure

---

## 🔑 API Endpoints

### 1. Create Payment URL

**POST** `/api/payment/create_payment_url`

**Authentication**: Required (Bearer Token)

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

**Error Response:**
```json
{
  "success": false,
  "message": "Không tìm thấy đơn hàng"
}
```

### 2. VNPay Return Callback

**GET** `/api/payment/vnpay_return`

**Authentication**: Not required (VNPay callback)

**Query Parameters** (được VNPay gửi):
- `vnp_TxnRef` - Order ID
- `vnp_ResponseCode` - Response code
- `vnp_TransactionNo` - VNPay transaction number
- `vnp_SecureHash` - Chữ ký để verify
- ... và nhiều params khác

**Behavior:**
- Verify chữ ký từ VNPay
- Cập nhật Order status nếu thanh toán thành công
- Redirect về frontend với kết quả:
  - **Success**: `/order-success?code=00&orderId=...&transactionNo=...`
  - **Failure**: `/order-failure?code=...&orderId=...`

---

## 🔄 Flow thanh toán

```
1. User chọn sản phẩm và đi đến checkout
2. User chọn payment method = "Credit Card / Debit Card"
3. User nhập địa chỉ, số điện thoại và click "Place Order"
4. Frontend tạo Order qua API: POST /api/orders
5. Backend tạo Order với payment_status = 'pending'
6. Frontend nhận orderId và gọi API: POST /api/payment/create_payment_url
7. Backend tạo URL thanh toán VNPay với chữ ký HMAC SHA512
8. Frontend redirect User đến VNPay payment page
9. User nhập thông tin thẻ trên VNPay
10. VNPay xử lý thanh toán và redirect về: GET /api/payment/vnpay_return
11. Backend verify chữ ký, cập nhật Order status
12. Backend redirect về Frontend với kết quả
```

### Payment Status Flow

```
pending (tạo order) → paid (thanh toán thành công) → processing → shipped → delivered
                    → failed (thanh toán thất bại)
```

---

## 💻 Sử dụng trong Frontend

### Ví dụ trong PaymentPage.tsx

```tsx
import { useVNPayPayment } from '@/hooks/useVNPayPayment';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/api/orderApi';

const PaymentPage = () => {
    const vnpayPayment = useVNPayPayment();
    
    const createOrderMutation = useMutation({
        mutationFn: createOrder,
        onSuccess: (res) => {
            const orderId = res.data?.order_id;
            const totalPrice = finalPrice;

            // Nếu chọn Credit Card, redirect đến VNPay
            if (paymentMethod === 'credit_card' && orderId) {
                vnpayPayment.mutate({
                    orderId: orderId,
                    amount: totalPrice
                });
            }
        }
    });

    return (
        // ... UI components
    );
};
```

### Ví dụ sử dụng trực tiếp API

```tsx
import { createVNPayPaymentUrl } from '@/api/paymentApi';

const handleVNPayPayment = async () => {
    try {
        const { paymentUrl } = await createVNPayPaymentUrl({
            orderId: 123,
            amount: 500000
        });
        
        // Redirect đến VNPay
        window.location.href = paymentUrl;
    } catch (error) {
        console.error('Lỗi tạo URL thanh toán:', error);
    }
};
```

---

## 🧪 Testing

### Test Card Information

- **Ngân hàng**: NCB
- **Số thẻ**: `9704198526191432198`
- **Tên chủ thẻ**: `NGUYEN VAN A`
- **Ngày phát hành**: `07/15`
- **Mã OTP**: `123456`

### Test Scenarios

1. **Thanh toán thành công**:
   - Nhập đúng thông tin test card
   - Nhập OTP: 123456
   - Kết quả: Redirect về `/order-success`
   - Order status = 'processing', payment_status = 'paid'

2. **Thanh toán thất bại (hủy)**:
   - Click "Hủy giao dịch" trên VNPay
   - Kết quả: Redirect về `/order-failure?code=24`
   - Order status giữ nguyên, payment_status = 'pending'

3. **Thanh toán thất bại (sai OTP)**:
   - Nhập sai OTP quá 3 lần
   - Kết quả: Redirect về `/order-failure?code=13`

4. **Thanh toán COD (không qua VNPay)**:
   - Chọn payment method: "Cash on Delivery"
   - Kết quả: Tạo order thành công, redirect ngay đến `/order-success`
   - Không qua VNPay

### Kiểm tra kết quả

**Backend Logs:**
```
Đơn hàng được tạo với payment_status: pending
VNPay callback nhận được với responseCode: 00
Order status cập nhật thành: paid
```

**Database:**
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

---

## 🛠️ Troubleshooting

### 1. "Invalid signature" error

**Nguyên nhân**: Chữ ký không khớp

**Giải pháp**:
- Kiểm tra `VNP_HASHSECRET` trong .env, phải đúng `U7UH60FWH6D7YWARUURCLYPS4LTTCK82`
- Đảm bảo params được sort đúng thứ tự alphabet
- Kiểm tra encoding của query string

### 2. "Order not found" error

**Nguyên nhân**: orderId không tồn tại hoặc không thuộc về user

**Giải pháp**:
- Kiểm tra orderId có được tạo thành công không
- Kiểm tra user có quyền truy cập order này không

### 3. Payment không được cập nhật

**Nguyên nhân**: Callback từ VNPay không được xử lý

**Giải pháp**:
- Kiểm tra vnp_ReturnUrl có đúng không
- Kiểm tra server có đang chạy không
- Kiểm tra logs backend để xem có lỗi gì

### 4. Redirect về frontend không hoạt động

**Nguyên nhân**: Frontend URL sai hoặc CORS

**Giải pháp**:
- Kiểm tra CLIENT_URL trong .env
- Đảm bảo CORS được cấu hình đúng
- Kiểm tra port frontend (5173)

### 5. "module is not defined" error

**Giải pháp**: Migration file phải có extension `.cjs`, không phải `.js`

### 6. Server không khởi động được

**Giải pháp**:
- Kiểm tra port 3000 đã được sử dụng chưa
- Kiểm tra database connection
- Xem logs để biết lỗi cụ thể

### 7. VNPay không redirect về

**Giải pháp**:
- Kiểm tra `vnp_ReturnUrl` trong `backend/config/vnpay.js`
- Đảm bảo backend đang chạy ở port 3000

---

## 🔐 Security & Best Practices

### Chữ ký HMAC SHA512

VNPay sử dụng HMAC SHA512 để đảm bảo tính toàn vẹn của dữ liệu:

```javascript
// Tạo chữ ký (Backend)
const signData = qs.stringify(sortedParams, { encode: false });
const hmac = crypto.createHmac('sha512', vnp_HashSecret);
const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

// Verify chữ ký (Backend)
if (secureHash !== signed) {
    // Chữ ký không hợp lệ - reject request
}
```

### Quan trọng:
1. **LUÔN** sort params theo alphabet trước khi sign
2. **LUÔN** verify chữ ký ở callback
3. **KHÔNG BAO GIỜ** expose vnp_HashSecret ra client
4. **LUÔN** validate orderId thuộc về user hiện tại
5. **Luôn validate input** từ client trước khi gọi VNPay API
6. **Sử dụng transaction** khi cập nhật Order status
7. **Log tất cả giao dịch** để dễ debug
8. **Xử lý timeout** - VNPay có thời gian chờ thanh toán
9. **Test kỹ các trường hợp edge case** trước khi deploy production
10. **Backup database** trước khi chạy migration
11. **Monitor callback endpoint** để đảm bảo luôn hoạt động

### Verified Reviews Logic

Review controller đã được cập nhật để chỉ cho phép review khi:

```javascript
// Backend: reviewController.js
const deliveredOrder = await Order.findOne({
    where: {
        user_id: req.user.user_id,
        status: ORDER_STATUS.DELIVERED
    },
    include: [{
        model: OrderItem,
        where: { book_id },
        required: true
    }]
});

if (!deliveredOrder) {
    return res.status(403).json({ 
        msg: 'Bạn chỉ có thể đánh giá sách sau khi đơn hàng đã được giao thành công' 
    });
}
```

---

## 🚀 Deployment

### Environment Variables (Production)

```env
# VNPay Production (Thay thế khi có credentials thật)
VNP_TMNCODE=YOUR_PRODUCTION_TMNCODE
VNP_HASHSECRET=YOUR_PRODUCTION_HASHSECRET

# URLs
CLIENT_URL=https://your-domain.com
```

### VNPay Production URL

Khi deploy production, thay đổi trong `backend/config/vnpay.js`:

```javascript
vnp_Url: 'https://vnpayment.vn/paymentv2/vpcpay.html', // Production
vnp_ReturnUrl: 'https://your-api-domain.com/api/payment/vnpay_return'
```

### Checklist Deploy

- [ ] Cập nhật VNP_TMNCODE và VNP_HASHSECRET production
- [ ] Thay đổi vnp_Url sang production URL
- [ ] Cập nhật vnp_ReturnUrl với domain thật
- [ ] Chạy migration trên production database
- [ ] Test thanh toán với thẻ thật (môi trường production)
- [ ] Cấu hình HTTPS cho callback URL
- [ ] Monitor logs để phát hiện lỗi sớm

---

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

---

## 📞 Support

Nếu gặp vấn đề khi tích hợp VNPay:

1. Kiểm tra logs backend để xem lỗi chi tiết
2. Đọc tài liệu VNPay: https://sandbox.vnpayment.vn/apis/
3. Kiểm tra phần Troubleshooting ở trên
4. Contact VNPay support nếu có vấn đề với credentials

---

**Version**: 1.0.0  
**Last Updated**: 2024-12-29  
**Status**: ✅ Production Ready

