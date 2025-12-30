# 📊 PHÂN TÍCH CÁC TÍNH NĂNG CÒN THIẾU (GAP FEATURES)

**Ngày phân tích:** 2025-01-XX  
**Cập nhật lần cuối:** 2025-01-XX  
**Dự án:** Bookstore E-commerce  
**Trạng thái:** Backend ~90% hoàn thành, Frontend ~75% hoàn thành

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

### 3. **User Profile Page** ✅ **ĐÃ HOÀN THÀNH**

**Backend:** ✅ **ĐÃ HOÀN THÀNH**
- ✅ API `GET /api/users` (admin only) - Lấy danh sách users
- ✅ API `PUT /api/users/profile` - Cập nhật thông tin user (name, phone, address, avatar)
- ✅ API `PUT /api/users/change-password` - Đổi mật khẩu
- ✅ Upload avatar tích hợp với Cloudinary
- ⚠️ **LƯU Ý:** User info được lấy từ JWT token, không cần API riêng `GET /api/users/me`

**Frontend:** ✅ **ĐÃ HOÀN THÀNH**
- ✅ Trang Profile (`ProfilePage.tsx`) với sidebar navigation
- ✅ Route `/profile` đã được thêm vào `routes/index.tsx`
- ✅ Component `ProfileTab.tsx` với form cập nhật thông tin cá nhân
- ✅ Form đổi mật khẩu tích hợp trong `ProfileTab`
- ✅ Upload avatar UI với preview
- ✅ Hook `useAuth` có `updateProfile` và `changePassword` mutations
- ✅ API client `authApi.ts` có `updateProfile` và `changePassword` functions

**Trạng thái:** ✅ **HOÀN THÀNH** - Người dùng có thể quản lý thông tin cá nhân, đổi mật khẩu, và cập nhật avatar.

---

### 4. **Order History Page** ✅ **ĐÃ HOÀN THÀNH**

**Backend:** ✅ **ĐÃ HOÀN THÀNH**
- ✅ API `GET /api/orders` - Lấy đơn hàng của user
- ✅ API `GET /api/orders/my-orders` - Lấy đơn hàng với timeline status
- ✅ Response có `status_history` với timeline chi tiết

**Frontend:** ✅ **ĐÃ HOÀN THÀNH**
- ✅ Trang Order History (`MyOrdersPage.tsx`) - Trang riêng biệt
- ✅ Component `OrdersTab.tsx` - Tab trong ProfilePage
- ✅ Route `/my-orders` đã được thêm vào `routes/index.tsx`
- ✅ API client function `getMyOrders` trong `orderApi.ts`
- ✅ Hook `useMyOrders` và `useCancelOrder` trong `useOrders.ts`
- ✅ Component `OrderDetail.tsx` hiển thị chi tiết đơn hàng với timeline
- ✅ Component `ReviewModal.tsx` để tạo review từ order history
- ✅ Hiển thị timeline trạng thái đơn hàng với icons và colors

**Trạng thái:** ✅ **HOÀN THÀNH** - Người dùng có thể xem lịch sử đơn hàng, chi tiết đơn hàng, và tạo review.

---

### 5. **Admin Dashboard** ✅ **ĐÃ HOÀN THÀNH**

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
- ✅ API quản lý Genres, Authors, Publishers

**Frontend:** ✅ **ĐÃ HOÀN THÀNH**
- ✅ Trang Admin Dashboard (`AdminPage.tsx`) với tab-based navigation
- ✅ Component `DashboardTab.tsx` - Thống kê với charts (Recharts)
- ✅ Component `UsersTab.tsx` - Quản lý users với search, pagination
- ✅ Component `BooksTab.tsx` - Quản lý sách với CRUD đầy đủ
- ✅ Component `OrdersTab.tsx` - Quản lý đơn hàng với update status
- ✅ Component `GenresTab.tsx` - Quản lý thể loại
- ✅ Component `AuthorsTab.tsx` - Quản lý tác giả
- ✅ Component `PublishersTab.tsx` - Quản lý nhà xuất bản
- ✅ Component `DiscountsTab.tsx` - Quản lý mã giảm giá
- ✅ Component `AdminSidebar.tsx` - Navigation menu
- ✅ Route `/admin` đã được thêm vào `routes/index.tsx`
- ✅ Client-side protection (check role='admin' trong component)
- ✅ Hooks: `useAdmin`, `useAdminBooks`, `useAdminOrders`, `useAdminGenres`, `useAdminAuthors`, `useAdminPublishers`, `useAdminPromos`

**Trạng thái:** ✅ **HOÀN THÀNH** - Admin có thể quản lý toàn bộ hệ thống qua UI.

**Lưu ý:** ⚠️ Chưa có ProtectedRoute component riêng, nhưng đã có client-side check trong AdminPage.

---

## ⚠️ CÁC TÍNH NĂNG CẦN CẢI THIỆN

### 6. **Review System Enhancement** ⚠️ **CÓ MỘT PHẦN**

**Backend:** ✅ **CÓ CƠ BẢN**
- ✅ API `POST /api/reviews` - Tạo review
- ✅ API `GET /api/reviews/book/:book_id` - Lấy reviews theo sách
- ❌ **THIẾU** API `PUT /api/reviews/:id` - Sửa review
- ❌ **THIẾU** API `DELETE /api/reviews/:id` - Xóa review

**Frontend:** ⚠️ **CÓ MỘT PHẦN**
- ✅ Component `BookReviews` hiển thị reviews
- ✅ Component `ReviewModal.tsx` - Form tạo review với star rating
- ✅ ReviewModal được tích hợp trong `MyOrdersPage.tsx` để tạo review sau khi mua
- ✅ Component `dialog.tsx` đã được tạo (Radix UI Dialog)
- ❌ **THIẾU** Form tạo review trực tiếp trên `BookDetailPage`
- ❌ **THIẾU** Chức năng edit/delete review của chính user
- ❌ **THIẾU** Phân trang reviews
- ❌ **THIẾU** Filter reviews theo rating

**Độ ưu tiên:** 🟡 **TRUNG BÌNH** - Cải thiện UX. Đã có cơ bản, cần bổ sung edit/delete và phân trang.

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

1. **Wishlist UI** - Backend đã xong, chỉ cần frontend ⚠️ **ĐANG THIẾU**
2. **Search & Filter UI** - Backend đã xong, chỉ cần frontend ⚠️ **ĐANG THIẾU**
3. ~~**User Profile Page**~~ - ✅ **ĐÃ HOÀN THÀNH**
4. ~~**Order History Page**~~ - ✅ **ĐÃ HOÀN THÀNH**
5. ~~**Admin Dashboard**~~ - ✅ **ĐÃ HOÀN THÀNH**

### 🟡 **ƯU TIÊN TRUNG BÌNH** (Có thể làm sau)

6. Review System Enhancement
7. Payment Gateway Integration
8. Email Notifications
9. Protected Routes
10. Search Input Logic

---

## 📊 THỐNG KÊ

### Backend
- ✅ **Đã hoàn thành:** ~90%
- ⚠️ **Cần bổ sung:** Review edit/delete APIs
- ❌ **Chưa có:** Payment gateway integration (VNPay đã có nhưng chưa tích hợp đầy đủ)

### Frontend
- ✅ **Đã hoàn thành:** ~75%
- ✅ **Đã hoàn thành:** Profile Page, Order History, Admin Dashboard, Review Modal
- ❌ **Thiếu hoàn toàn:** Wishlist UI, Search/Filter UI
- ⚠️ **Cần cải thiện:** Review edit/delete, Protected routes, Search input logic

### Tổng thể
- **Mức độ hoàn thiện:** ~82%
- **Gap chính:** Còn thiếu Wishlist UI và Search/Filter UI - hai tính năng quan trọng cho user experience

---

## 🎯 KHUYẾN NGHỊ

### Phase 1: Hoàn thiện Core Features (Đã hoàn thành ~80%)
1. ⚠️ **Wishlist UI** (1-2 ngày) - ⚠️ **CHƯA LÀM**
2. ⚠️ **Search & Filter UI** (3-4 ngày) - ⚠️ **CHƯA LÀM**
3. ✅ User Profile Page + Backend APIs (2-3 ngày) - ✅ **ĐÃ HOÀN THÀNH**
4. ✅ Order History Page (2-3 ngày) - ✅ **ĐÃ HOÀN THÀNH**
5. ✅ Admin Dashboard cơ bản (5-7 ngày) - ✅ **ĐÃ HOÀN THÀNH**

### Phase 2: Cải thiện & Tối ưu (1-2 tuần)
1. Review System Enhancement
2. Protected Routes
3. Email Notifications
4. Payment Gateway (nếu cần)

---

## 📝 GHI CHÚ

- Tất cả các tính năng backend đã được test và hoạt động tốt (theo API_DOCUMENTATION.md)
- Frontend có UI đẹp và responsive với Tailwind CSS
- Đã hoàn thành nhiều tính năng quan trọng: Profile, Order History, Admin Dashboard
- Còn thiếu 2 tính năng chính: **Wishlist UI** và **Search & Filter UI**
- Component `dialog.tsx` đã được tạo để hỗ trợ ReviewModal và các modal khác
- Admin Dashboard đã hoàn chỉnh với đầy đủ các tabs quản lý

## 🎉 TIẾN ĐỘ GẦN ĐÂY

### ✅ Đã hoàn thành (2025-01-XX):
- User Profile Page với update profile và change password
- Order History Page với timeline và review modal
- Admin Dashboard đầy đủ với 8 tabs quản lý
- Review Modal component với star rating
- Dialog UI component (Radix UI)

### ⚠️ Cần hoàn thiện:
- Wishlist UI (backend đã sẵn sàng)
- Search & Filter UI (backend đã sẵn sàng)
- Review edit/delete APIs và UI
- Protected Routes component

---

**Tác giả:** AI Assistant  
**Cập nhật lần cuối:** 2025-01-XX



