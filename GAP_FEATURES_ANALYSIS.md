# 📊 PHÂN TÍCH CÁC TÍNH NĂNG CÒN THIẾU (GAP FEATURES)

**Ngày phân tích:** 2025-01-XX  
**Dự án:** Bookstore E-commerce  
**Trạng thái:** Backend ~85% hoàn thành, Frontend ~60% hoàn thành

---

## 🎯 TỔNG QUAN

Dự án đã có nền tảng vững chắc với các tính năng core đã được implement ở backend. Tuy nhiên, có một số **gap features** quan trọng cần được hoàn thiện, đặc biệt là ở **frontend** và một số tính năng admin.

---

## ❌ CÁC TÍNH NĂNG CÒN THIẾU HOÀN TOÀN

### 1. **Wishlist/Favorites UI** 🔴 **QUAN TRỌNG**

**Backend:** ✅ **ĐÃ HOÀN THÀNH 100%**
- ✅ Model `Wishlist` với unique constraint (user_id, book_id)
- ✅ API `POST /api/wishlist/toggle` - Thêm/xóa sách khỏi wishlist
- ✅ API `GET /api/wishlist` - Lấy danh sách yêu thích
- ✅ Routes đã đăng ký trong `server.js`
- ✅ Controller đã implement đầy đủ

**Frontend:** ❌ **CHƯA CÓ**
- ❌ Không có API client functions (`wishlistApi.ts`)
- ❌ Không có custom hooks (`useWishlist.ts`)
- ❌ Không có trang wishlist (`WishlistPage.tsx`)
- ❌ Không có nút "Yêu thích" trên `BookCard` (có icon Heart nhưng chưa có logic)
- ❌ Không có route `/wishlist` trong `routes/index.tsx`
- ❌ Không có link đến wishlist trong Header/User menu

**Ảnh hưởng:** Người dùng không thể sử dụng tính năng yêu thích sách mặc dù backend đã sẵn sàng.

**Độ ưu tiên:** 🔴 **CAO** - Backend đã xong, chỉ cần implement frontend.

---

### 2. **Search & Filter UI** 🔴 **QUAN TRỌNG**

**Backend:** ✅ **ĐÃ HOÀN THÀNH 100%**
- ✅ API `GET /api/books` với đầy đủ filters:
  - `keyword` - Tìm kiếm theo title
  - `min_price`, `max_price` - Lọc theo giá
  - `genre` - Lọc theo thể loại (IDs hoặc names)
  - `rating` - Lọc theo rating trung bình (>= value)
  - `sort` - Sắp xếp: `price-asc`, `price-desc`, `newest`, `top-rated`
  - `page`, `limit` - Pagination
- ✅ 2-step query strategy để tránh mất Authors/Genres khi GROUP BY
- ✅ Trả về `avg_rating` cho mỗi sách

**Frontend:** ❌ **CHƯA CÓ UI**
- ❌ Input search trong Header (line 60-63) **chưa có logic xử lý**
- ❌ Không có trang Search/Filter (`SearchPage.tsx`)
- ❌ Không có filter sidebar (genre, price range, rating)
- ❌ Không có sort dropdown/buttons
- ❌ Không có pagination UI
- ❌ Không có API client function để gọi search với filters
- ❌ Không có route `/search` hoặc `/books`

**Ảnh hưởng:** Người dùng không thể tìm kiếm và lọc sách mặc dù backend đã hỗ trợ đầy đủ.

**Độ ưu tiên:** 🔴 **CAO** - Tính năng cốt lõi của e-commerce.

---

### 3. **User Profile Page** 🔴 **QUAN TRỌNG**

**Backend:** ⚠️ **MỘT PHẦN**
- ✅ API `GET /api/users` (admin only) - Lấy danh sách users
- ❌ **THIẾU** API `GET /api/users/me` - Lấy thông tin user hiện tại
- ❌ **THIẾU** API `PUT /api/users/me` - Cập nhật thông tin user
- ❌ **THIẾU** API `PUT /api/users/me/password` - Đổi mật khẩu
- ❌ **THIẾU** API `POST /api/users/me/avatar` - Upload avatar

**Frontend:** ❌ **CHƯA CÓ**
- ❌ Không có trang Profile (`ProfilePage.tsx`)
- ❌ Header có link đến `/profile` (line 84) nhưng **route chưa tồn tại**
- ❌ Không có form cập nhật thông tin cá nhân
- ❌ Không có form đổi mật khẩu
- ❌ Không có upload avatar UI

**Ảnh hưởng:** Người dùng không thể quản lý thông tin cá nhân, đổi mật khẩu, hoặc cập nhật avatar.

**Độ ưu tiên:** 🔴 **CAO** - Tính năng cơ bản của user account.

---

### 4. **Order History Page** 🔴 **QUAN TRỌNG**

**Backend:** ✅ **ĐÃ HOÀN THÀNH**
- ✅ API `GET /api/orders` - Lấy đơn hàng của user
- ✅ API `GET /api/orders/my-orders` - Lấy đơn hàng với timeline status
- ✅ Response có `status_history` với timeline chi tiết

**Frontend:** ❌ **CHƯA CÓ**
- ❌ Không có trang Order History (`OrderHistoryPage.tsx`)
- ❌ `OrderSuccessPage` có link đến `/orders` (line 202) nhưng **route chưa tồn tại**
- ❌ Không có API client function (`orderApi.ts` chỉ có `createOrder`, `checkPromoCode`)
- ❌ Không có component hiển thị timeline trạng thái đơn hàng
- ❌ Không có trang chi tiết đơn hàng (`OrderDetailPage.tsx`)

**Ảnh hưởng:** Người dùng không thể xem lịch sử đơn hàng sau khi đặt hàng thành công.

**Độ ưu tiên:** 🔴 **CAO** - Tính năng quan trọng cho user experience.

---

### 5. **Admin Dashboard** 🔴 **RẤT QUAN TRỌNG**

**Backend:** ✅ **ĐÃ HOÀN THÀNH**
- ✅ API `GET /api/admin/stats` - Thống kê dashboard
- ✅ API `GET /api/users` - Lấy danh sách users (admin only)
- ✅ API `GET /api/orders/all` - Lấy tất cả đơn hàng (admin only)
- ✅ API `PUT /api/orders/:order_id/status` - Cập nhật trạng thái đơn hàng
- ✅ API `POST /api/books` - Tạo sách (admin only)
- ✅ API `PUT /api/books/:id` - Cập nhật sách (admin only)
- ✅ API `DELETE /api/books/:id` - Xóa sách (admin only)
- ✅ API `GET /api/promos/all` - Lấy tất cả promos (admin only)
- ✅ API `POST /api/promos` - Tạo promo (admin only)

**Frontend:** ❌ **CHƯA CÓ HOÀN TOÀN**
- ❌ Không có trang Admin Dashboard (`AdminDashboard.tsx`)
- ❌ Không có trang quản lý sách (`AdminBooksPage.tsx`)
- ❌ Không có trang quản lý đơn hàng (`AdminOrdersPage.tsx`)
- ❌ Không có trang quản lý users (`AdminUsersPage.tsx`)
- ❌ Không có trang quản lý promos (`AdminPromosPage.tsx`)
- ❌ Không có protected routes cho admin
- ❌ Không có admin navigation/menu
- ❌ Không có role-based UI (hiển thị menu admin cho user có role='admin')

**Ảnh hưởng:** Admin không thể quản lý hệ thống qua UI, phải dùng Postman hoặc tools khác.

**Độ ưu tiên:** 🔴 **RẤT CAO** - Cần thiết để vận hành hệ thống.

---

## ⚠️ CÁC TÍNH NĂNG CẦN CẢI THIỆN

### 6. **Review System Enhancement** 🟡

**Backend:** ✅ **CÓ CƠ BẢN**
- ✅ API `POST /api/reviews` - Tạo review
- ✅ API `GET /api/reviews/book/:book_id` - Lấy reviews theo sách
- ❌ **THIẾU** API `PUT /api/reviews/:id` - Sửa review
- ❌ **THIẾU** API `DELETE /api/reviews/:id` - Xóa review

**Frontend:** ⚠️ **CÓ MỘT PHẦN**
- ✅ Component `BookReviews` hiển thị reviews
- ❌ **THIẾU** Form tạo review trên `BookDetailPage`
- ❌ **THIẾU** Chức năng edit/delete review của chính user
- ❌ **THIẾU** Phân trang reviews
- ❌ **THIẾU** Filter reviews theo rating

**Độ ưu tiên:** 🟡 **TRUNG BÌNH** - Cải thiện UX.

---

### 7. **Payment Gateway Integration** 🟡

**Backend:** ❌ **CHƯA CÓ**
- ❌ Chưa tích hợp PayPal SDK
- ❌ Chưa tích hợp Stripe/VNPay
- ❌ Chưa có webhook handler
- ⚠️ Chỉ lưu `payment_method` vào DB, không xử lý thanh toán thực tế

**Frontend:** ⚠️ **CÓ UI**
- ✅ `PaymentPage` có 3 options: COD, PayPal, Credit Card
- ❌ Chưa có logic xử lý thanh toán PayPal
- ❌ Chưa có logic xử lý thanh toán Credit Card

**Độ ưu tiên:** 🟡 **TRUNG BÌNH** - Có thể dùng COD trước, tích hợp sau.

---

### 8. **Email Notifications** 🟡

**Backend:** ⚠️ **CÓ MỘT PHẦN**
- ✅ Có `utils/email.js` với Nodemailer
- ✅ Đã dùng để gửi OTP (register, reset password)
- ❌ **THIẾU** Email xác nhận đơn hàng
- ❌ **THIẾU** Email cập nhật trạng thái đơn hàng
- ❌ **THIẾU** Email welcome sau đăng ký

**Frontend:** N/A

**Độ ưu tiên:** 🟡 **TRUNG BÌNH** - Cải thiện UX, không bắt buộc.

---

### 9. **Protected Routes** 🟡

**Frontend:** ❌ **CHƯA CÓ**
- ❌ Không có component `ProtectedRoute` hoặc `PrivateRoute`
- ❌ Không có `AdminRoute` component
- ❌ Các trang như `/cart`, `/checkout` có thể truy cập khi chưa đăng nhập (chỉ check trong component)

**Độ ưu tiên:** 🟡 **TRUNG BÌNH** - Cải thiện security và UX.

---

### 10. **Search Input Logic** 🟡

**Frontend:** ⚠️ **CÓ UI, THIẾU LOGIC**
- ✅ Có input search trong Header (line 60-63)
- ❌ Không có `onChange` handler
- ❌ Không có `onSubmit` handler
- ❌ Không có debounce
- ❌ Không có navigation đến search results

**Độ ưu tiên:** 🟡 **TRUNG BÌNH** - Liên quan đến Search & Filter UI.

---

## 📋 TÓM TẮT THEO ĐỘ ƯU TIÊN

### 🔴 **ƯU TIÊN CAO** (Cần làm ngay)

1. **Wishlist UI** - Backend đã xong, chỉ cần frontend
2. **Search & Filter UI** - Backend đã xong, chỉ cần frontend
3. **User Profile Page** - Cần cả backend API và frontend
4. **Order History Page** - Backend đã xong, chỉ cần frontend
5. **Admin Dashboard** - Backend đã xong, cần xây dựng toàn bộ frontend

### 🟡 **ƯU TIÊN TRUNG BÌNH** (Có thể làm sau)

6. Review System Enhancement
7. Payment Gateway Integration
8. Email Notifications
9. Protected Routes
10. Search Input Logic

---

## 📊 THỐNG KÊ

### Backend
- ✅ **Đã hoàn thành:** ~85%
- ⚠️ **Cần bổ sung:** User profile APIs, Review edit/delete APIs
- ❌ **Chưa có:** Payment gateway integration

### Frontend
- ✅ **Đã hoàn thành:** ~60%
- ❌ **Thiếu hoàn toàn:** Wishlist UI, Search/Filter UI, Profile, Order History, Admin Dashboard
- ⚠️ **Cần cải thiện:** Review form, Protected routes, Search input logic

### Tổng thể
- **Mức độ hoàn thiện:** ~70%
- **Gap chính:** Frontend chưa implement nhiều tính năng mà backend đã có

---

## 🎯 KHUYẾN NGHỊ

### Phase 1: Hoàn thiện Core Features (2-3 tuần)
1. ✅ Wishlist UI (1-2 ngày)
2. ✅ Search & Filter UI (3-4 ngày)
3. ✅ User Profile Page + Backend APIs (2-3 ngày)
4. ✅ Order History Page (2-3 ngày)
5. ✅ Admin Dashboard cơ bản (5-7 ngày)

### Phase 2: Cải thiện & Tối ưu (1-2 tuần)
1. Review System Enhancement
2. Protected Routes
3. Email Notifications
4. Payment Gateway (nếu cần)

---

## 📝 GHI CHÚ

- Tất cả các tính năng backend đã được test và hoạt động tốt (theo API_DOCUMENTATION.md)
- Frontend có UI đẹp và responsive với Tailwind CSS
- Cần tập trung vào việc kết nối frontend với các APIs đã có
- Admin Dashboard là ưu tiên cao nhất vì cần thiết để vận hành hệ thống

---

**Tác giả:** AI Assistant  
**Cập nhật lần cuối:** 2025-01-XX



