# 📘 HƯỚNG DẪN TÍCH HỢP VNPAY - DEVELOPER GUIDE

## 🎯 Tổng quan

Tài liệu này mô tả chi tiết cách VNPay đã được tích hợp vào dự án Bookstore E-commerce và cách sử dụng.

## 📂 Các file đã được tạo/cập nhật

### Backend

1. **`backend/config/vnpay.js`** - Cấu hình VNPay credentials
2. **`backend/controllers/paymentController.js`** - Controller xử lý payment logic
3. **`backend/routes/payment.js`** - Routes cho VNPay endpoints
4. **`backend/server.js`** - Mount payment routes (đã cập nhật)
5. **`backend/models/Order.js`** - Thêm payment_status và vnpay_transaction_no (đã cập nhật)
6. **`backend/migrations/20251229185446-add-vnpay-fields-to-orders.cjs`** - Migration cho các trường mới
7. **`backend/controllers/reviewController.js`** - Verified Reviews logic (đã cập nhật)

### Frontend

1. **`frontend/src/api/paymentApi.ts`** - API client cho VNPay
2. **`frontend/src/hooks/useVNPayPayment.ts`** - React Hook cho VNPay payment
3. **`frontend/src/pages/OrderFailurePage.tsx`** - Trang xử lý thanh toán thất bại
4. **`frontend/src/pages/PaymentPage.tsx`** - Tích hợp VNPay vào checkout flow (đã cập nhật)
5. **`frontend/src/routes/index.tsx`** - Thêm route cho order-failure (đã cập nhật)

## 🔧 Cách hoạt động

### Flow thanh toán VNPay

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
12. Backend redirect về Frontend:
    - Success: /order-success?code=00&orderId=...&transactionNo=...
    - Failure: /order-failure?code=...&orderId=...
```

## 🔑 API Endpoints

### 1. Create Payment URL

**POST** `/api/payment/create_payment_url`

**Authentication**: Required (Bearer Token)

**Request Body**:
```json
{
  "orderId": 123,
  "amount": 500000
}
```

**Response**:
```json
{
  "success": true,
  "message": "Tạo URL thanh toán thành công",
  "data": {
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
  }
}
```

**Error Response**:
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

**Behavior**:
- Verify chữ ký từ VNPay
- Cập nhật Order status nếu thanh toán thành công
- Redirect về frontend với kết quả

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

## 🔐 Security

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

2. **Thanh toán thất bại (hủy)**:
   - Click "Hủy giao dịch" trên VNPay
   - Kết quả: Redirect về `/order-failure?code=24`

3. **Thanh toán thất bại (sai OTP)**:
   - Nhập sai OTP quá 3 lần
   - Kết quả: Redirect về `/order-failure?code=13`

## 📊 Database Schema

### Orders Table (đã cập nhật)

```sql
ALTER TABLE Orders 
ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending' COMMENT 'Trạng thái thanh toán: pending, paid, failed',
ADD COLUMN vnpay_transaction_no VARCHAR(50) COMMENT 'Mã giao dịch VNPay';
```

### Payment Status Flow

```
pending (tạo order) → paid (thanh toán thành công) → processing → shipped → delivered
                    → failed (thanh toán thất bại)
```

## 🛠️ Troubleshooting

### 1. "Invalid signature" error

**Nguyên nhân**: Chữ ký không khớp

**Giải pháp**:
- Kiểm tra `VNP_HASHSECRET` trong .env
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

## 🔄 Verified Reviews Logic

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

## 📝 Best Practices

1. **Luôn validate input** từ client trước khi gọi VNPay API
2. **Sử dụng transaction** khi cập nhật Order status
3. **Log tất cả giao dịch** để dễ debug
4. **Xử lý timeout** - VNPay có thời gian chờ thanh toán
5. **Test kỹ các trường hợp edge case** trước khi deploy production
6. **Backup database** trước khi chạy migration
7. **Monitor callback endpoint** để đảm bảo luôn hoạt động

## 🚀 Deployment Notes

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

## 📞 Support

Nếu gặp vấn đề khi tích hợp VNPay:

1. Kiểm tra logs backend để xem lỗi chi tiết
2. Đọc tài liệu VNPay: https://sandbox.vnpayment.vn/apis/
3. Kiểm tra VNPAY_SETUP.md để xem thông tin cấu hình
4. Contact VNPay support nếu có vấn đề với credentials

---

**Version**: 1.0.0  
**Last Updated**: 2024-12-29  
**Status**: ✅ Production Ready

