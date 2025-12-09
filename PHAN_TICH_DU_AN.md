# PHÂN TÍCH TỔNG QUAN DỰ ÁN BOOKSTORE E-COMMERCE

## 1. TỔNG QUAN CẬP NHẬT

### 1.1. Trạng thái hiện tại (so với bản phân tích trước)
- Chưa thấy thêm module mới ngoài phạm vi đã mô tả (books, cart, orders, reviews, promos, auth).
- Một số chi tiết được làm rõ hơn trong code:
  - Order lưu `address`, `phone` và bắt buộc truyền khi tạo đơn.
  - Payment method chỉ là enum lưu vào DB (`cash_on_delivery`, `paypal`, `credit_card`), chưa có tích hợp cổng thanh toán.
  - Promo áp dụng trực tiếp trên tổng tiền, giảm phần trăm, có kiểm tra `min_amount` và `expiry_date`.
  - CartItem có unique index `(user_id, book_id)`, dùng để tránh trùng sản phẩm trong giỏ.
  - Upload bìa sách dùng Multer + Cloudinary, xóa file tạm sau upload.
  - Quan hệ N:N Book-Author và Book-Genre đã được thiết lập và gọi `addAuthors/addGenres` khi tạo sách.

### 1.2. Kiến trúc kỹ thuật (không đổi)

**Backend:**
- **Framework**: Node.js với Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (Access Token + Refresh Token)
- **File Upload**: Cloudinary (cho ảnh bìa sách)
- **Email**: Nodemailer (gửi OTP)
- **Session Management**: Custom Session model với refresh token

**Frontend:**
- **Framework**: React 19 với TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand (cho auth và cart)
- **Data Fetching**: TanStack React Query
- **Routing**: React Router DOM v7
- **UI Components**: Radix UI + Tailwind CSS
- **Form Handling**: React Hook Form + Zod validation
- **Notifications**: Sonner (toast notifications)

### 1.3. Cập nhật gần nhất (commit ~19h trước: `32ce194` – add-to-cart quantity)
- `useAddToCart` nhận `{ book, quantity }`, gửi quantity xuống API, optimistic update dùng đúng số lượng truyền vào.
- `useCartStore.addToCart` hỗ trợ quantity tùy chọn; nếu đã có item thì cộng thêm quantity, nếu chưa có thì thêm mới với quantity khởi tạo.
- `BookCard` gọi `addToCart` với `{ book, quantity: 1 }`; `BookDetailCard` gọi với quantity người dùng chọn.
- `onError` trong `useAddToCart` hiện chỉ hiển thị toast, không rollback optimistic update (cần cân nhắc nếu muốn khôi phục state khi API lỗi).

### 1.4. Cấu trúc thư mục

```
bookstore-e-commerce/
├── backend/
│   ├── config/          # Database config, Sequelize config
│   ├── controllers/      # Business logic cho các routes
│   ├── middleware/       # Auth middleware, response middleware
│   ├── models/           # Sequelize models (13 models)
│   ├── routes/           # API routes
│   ├── migrations/       # Database migrations
│   ├── seeders/          # Database seeders
│   ├── utils/            # Email utilities
│   └── constants/        # Auth constants
├── frontend/
│   ├── src/
│   │   ├── api/          # API client functions
│   │   ├── components/   # React components
│   │   ├── features/     # Feature-based stores (auth, cart)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layouts/      # Header, Footer
│   │   ├── pages/        # Page components
│   │   ├── routes/       # Route definitions
│   │   ├── schemas/      # Zod validation schemas
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
```

---

## 2. DATABASE SCHEMA (cập nhật nhẹ)

### 2.1. Các bảng chính

**User (Người dùng)**
- `user_id` (PK)
- `name`, `email`, `password` (hashed với bcrypt)
- `address`, `phone`
- `role` (admin/customer)
- `avatar` (URL)

**Book (Sách)**
- `book_id` (PK)
- `title`, `description`
- `publisher_id` (FK → Publisher)
- `stock`, `price`
- `cover_image` (URL từ Cloudinary)
- `release_date`, `isbn` (unique)

**Order (Đơn hàng)**
- `order_id` (PK)
- `user_id` (FK → User)
- `promo_id` (FK → PromoCode, nullable)
- `total_price`
- `status` (processing/shipped/delivered/cancelled)
- `payment_method` (cash_on_delivery/paypal/credit_card)
- `order_date`
- `address`, `phone` (địa chỉ giao hàng) — bắt buộc khi tạo đơn

**OrderItem (Chi tiết đơn hàng)**
- `order_id` (FK → Order)
- `book_id` (FK → Book)
- `quantity`, `price`

**CartItem (Giỏ hàng)**
- `user_id` (FK → User)
- `book_id` (FK → Book)
- `quantity`
- Unique constraint: (user_id, book_id) — đảm bảo 1 user không có trùng sản phẩm trong giỏ

**Review (Đánh giá)**
- `review_id` (PK)
- `user_id` (FK → User)
- `book_id` (FK → Book)
- `rating` (1-5)
- `comment`, `review_date`
- Unique constraint: (user_id, book_id)

**PromoCode (Mã khuyến mãi)**
- `promo_id` (PK)
- `code` (unique)
- `discount_percent` (0-100)
- `min_amount` (số tiền tối thiểu)
- `expiry_date`

**Author, Genre, Publisher** (Danh mục)
- Quan hệ N:N với Book qua bảng trung gian `BookAuthor`, `BookGenre`

**Session (Phiên đăng nhập)**
- Quản lý refresh token cho authentication

**OtpTemp (OTP tạm thời)**
- Lưu OTP cho đăng ký và reset password

### 2.2. Quan hệ giữa các bảng

- User ↔ CartItem (1:N)
- User ↔ Order (1:N)
- User ↔ Review (1:N)
- Book ↔ CartItem (1:N)
- Book ↔ OrderItem (1:N)
- Book ↔ Review (1:N)
- Book ↔ Author (N:N qua BookAuthor)
- Book ↔ Genre (N:N qua BookGenre)
- Book ↔ Publisher (N:1)
- Order ↔ OrderItem (1:N)
- Order ↔ PromoCode (N:1, nullable)
- Order ↔ User (N:1)

---

## 3. CÁC TÍNH NĂNG ĐÃ HOÀN THÀNH (điều chỉnh mô tả)

### 3.1. Authentication & Authorization ✅

**Backend:**
- ✅ Đăng nhập với JWT (Access Token + Refresh Token)
- ✅ Refresh token lưu trong bảng `Session` (cookie httpOnly, secure)
- ✅ Đăng xuất (xóa session)
- ✅ Đăng ký với OTP qua email
- ✅ Reset password với OTP
- ✅ Middleware `auth` và `adminAuth`
- ✅ Session management với bảng Session

**Frontend:**
- ✅ Login page với form validation
- ✅ Register flow (3 bước: Request OTP → Verify OTP → Complete)
- ✅ Reset password flow (3 bước tương tự)
- ✅ Auth store với Zustand (persist)
- ✅ Protected routes (chưa có middleware, cần bổ sung)
- ✅ Auto refresh token (cần kiểm tra implementation)

### 3.2. Quản lý Sách (Books) ✅

**Backend:**
- ✅ CRUD sách (Create chỉ dành cho admin)
- ✅ Upload ảnh bìa lên Cloudinary
- ✅ Tìm kiếm sách theo title, author, genre
- ✅ Lọc theo giá (min_price, max_price)
- ✅ Sắp xếp (sort)
- ✅ Lấy sách mới phát hành (`/new-releases`)
- ✅ Lấy sách đánh giá cao (`/top-rated`)
- ✅ Lấy chi tiết sách với reviews, authors, genres
- ✅ Quan hệ N:N với Author và Genre

**Frontend:**
- ✅ Trang chủ với slider sách mới và top rated
- ✅ Trang chi tiết sách
- ✅ Hiển thị reviews, authors, genres
- ✅ Book card component
- ✅ Book slider component

### 3.3. Giỏ hàng (Cart) ✅

**Backend:**
- ✅ Thêm vào giỏ hàng
- ✅ Cập nhật số lượng
- ✅ Xóa khỏi giỏ hàng
- ✅ Lấy giỏ hàng của user (với thông tin sách đầy đủ)
- ✅ Tính tổng tiền

**Frontend:**
- ✅ Trang giỏ hàng với UI đầy đủ
- ✅ Chọn/bỏ chọn sản phẩm
- ✅ Chọn tất cả
- ✅ Cập nhật số lượng
- ✅ Xóa sản phẩm
- ✅ Xóa nhiều sản phẩm cùng lúc
- ✅ Tính tổng tiền cho các sản phẩm đã chọn
- ✅ Cart store với Zustand

### 3.4. Đơn hàng (Orders) ✅

**Backend:**
- ✅ Tạo đơn hàng từ giỏ hàng (yêu cầu `address`, `phone`, `payment_method`)
- ✅ Validate stock trước khi đặt hàng
- ✅ Áp dụng mã khuyến mãi (check expiry, min_amount, percent discount)
- ✅ Giảm stock sau khi đặt hàng
- ✅ Xóa giỏ hàng sau khi đặt hàng
- ✅ Transaction để đảm bảo data consistency
- ✅ Lấy danh sách đơn hàng của user
- ✅ Lấy tất cả đơn hàng (admin)
- ✅ Cập nhật trạng thái đơn hàng (admin)

**Frontend:**
- ✅ Trang thanh toán (PaymentPage)
- ✅ Nhập địa chỉ và số điện thoại
- ✅ Áp dụng mã khuyến mãi
- ✅ Chọn phương thức thanh toán (COD/PayPal/Credit Card - UI only)
- ✅ Tạo đơn hàng
- ✅ Trang thành công (OrderSuccessPage)

### 3.5. Đánh giá (Reviews) ✅

**Backend:**
- ✅ Tạo đánh giá (rating 1-5 + comment)
- ✅ Lấy đánh giá theo sách
- ✅ Unique constraint: mỗi user chỉ đánh giá 1 lần cho 1 sách

**Frontend:**
- ✅ Component hiển thị reviews
- ✅ Form tạo review (cần kiểm tra có trong BookDetailPage không)

### 3.6. Mã khuyến mãi (Promo Codes) ✅

**Backend:**
- ✅ Tạo mã khuyến mãi (admin)
- ✅ Kiểm tra mã khuyến mãi (validate expiry, min_amount)
- ✅ Tính toán giảm giá theo phần trăm
- ✅ Lấy tất cả mã khuyến mãi (admin)
- ⚠️ Chưa thấy hạn chế số lần sử dụng theo user/đơn (per-user usage chưa có)

**Frontend:**
- ✅ Input nhập mã khuyến mãi ở trang thanh toán
- ✅ Kiểm tra và áp dụng mã
- ✅ Hiển thị giá sau khi giảm

### 3.7. UI/UX Components ✅

**Components đã có:**
- ✅ Header với navigation
- ✅ Footer
- ✅ BookCard, BookDetailCard
- ✅ BookSlider
- ✅ BookReviews
- ✅ LoadingSpinner
- ✅ ErrorBoundary
- ✅ UI components từ Radix UI (Button, Input, Checkbox, Radio, Dropdown, Avatar, Label)

**Styling:**
- ✅ Tailwind CSS
- ✅ Responsive design
- ✅ Modern UI với purple theme

---

## 4. CÁC TÍNH NĂNG CÒN THIẾU / CẦN HOÀN THIỆN (nhấn mạnh)

### 4.1. Admin Dashboard ❌

**Hiện tại:**
- Backend đã có API endpoints cho admin (getUsers, getAllOrders, updateOrderStatus, addBook)
- Frontend CHƯA có trang admin dashboard

**Cần xây dựng:**
- ❌ Trang admin dashboard tổng quan
- ❌ Quản lý sách (CRUD đầy đủ: Edit, Delete)
- ❌ Quản lý đơn hàng (xem danh sách, cập nhật trạng thái)
- ❌ Quản lý người dùng
- ❌ Quản lý mã khuyến mãi (CRUD)
- ❌ Quản lý authors, genres, publishers
- ❌ Thống kê doanh thu, số lượng đơn hàng
- ❌ Protected routes cho admin

### 4.2. User Profile Management ❌

**Cần xây dựng:**
- ❌ Trang profile user
- ❌ Cập nhật thông tin cá nhân (name, email, phone, address)
- ❌ Đổi mật khẩu
- ❌ Upload avatar (hiện có field nhưng chưa có UI)
- ❌ Xem lịch sử đơn hàng
- ❌ Chi tiết đơn hàng

### 4.3. Tìm kiếm & Lọc nâng cao ❌

**Hiện tại:**
- Backend có search cơ bản (title, author, genre, price)
- Frontend chưa có trang search/filter

**Cần xây dựng:**
- ❌ Trang tìm kiếm với search bar
- ❌ Filter sidebar (theo genre, author, price range, rating)
- ❌ Pagination cho danh sách sách
- ❌ Sort options (giá, ngày phát hành, đánh giá)

### 4.4. Payment Gateway Integration ❌

**Hiện tại:**
- UI có 3 phương thức: COD, PayPal, Credit Card
- Chưa có tích hợp thực tế; payment method chỉ được lưu vào DB, không gọi cổng thanh toán

**Cần xây dựng:**
- ❌ Tích hợp PayPal SDK
- ❌ Tích hợp Stripe hoặc VNPay cho credit card
- ❌ Xử lý webhook từ payment gateway
- ❌ Cập nhật trạng thái đơn hàng sau khi thanh toán thành công

### 4.5. Email Notifications ❌

**Hiện tại:**
- Chỉ có email OTP (register, reset password)
- Chưa có email thông báo đơn hàng

**Cần xây dựng:**
- ❌ Email xác nhận đơn hàng
- ❌ Email cập nhật trạng thái đơn hàng
- ❌ Email welcome sau khi đăng ký
- ❌ Email quên mật khẩu (đã có OTP, cần thêm email template đẹp hơn)

### 4.6. Order Tracking ❌

**Cần xây dựng:**
- ❌ Trang theo dõi đơn hàng
- ❌ Hiển thị timeline trạng thái đơn hàng
- ❌ Thông tin vận chuyển (nếu có)

### 4.7. Wishlist / Favorites ❌

**Cần xây dựng:**
- ❌ Model Wishlist
- ❌ API thêm/xóa khỏi wishlist
- ❌ Trang wishlist của user
- ❌ Nút "Yêu thích" trên BookCard

### 4.8. Reviews Enhancement ❌

**Cần cải thiện:**
- ❌ Form tạo review trên BookDetailPage (nếu chưa có)
- ❌ Edit/Delete review của chính user
- ❌ Phân trang reviews
- ❌ Filter reviews theo rating
- ❌ Like/Helpful cho reviews

### 4.9. Inventory Management ❌

**Cần xây dựng:**
- ❌ Cảnh báo khi stock thấp
- ❌ Lịch sử nhập/xuất kho
- ❌ Quản lý stock từ admin

### 4.10. Security & Validation ❌

**Cần cải thiện:**
- ❌ Rate limiting cho API
- ❌ Input sanitization / validation chặt hơn ở backend (đặc biệt orders, promos, books)
- ❌ CSRF protection (nếu dùng cookie cho access token trong tương lai)
- ❌ File upload validation (size, type) cho ảnh bìa
- ❌ Stronger password requirements

### 4.11. Performance Optimization ❌

**Cần cải thiện:**
- ❌ Caching (Redis) cho danh sách sách
- ❌ Image optimization (lazy loading, WebP)
- ❌ Pagination cho tất cả danh sách
- ❌ Database indexing optimization
- ❌ Code splitting cho frontend

### 4.12. Testing ❌

**Cần xây dựng:**
- ❌ Unit tests cho backend
- ❌ Integration tests cho API
- ❌ E2E tests cho frontend
- ❌ Test coverage

---

## 5. ĐÁNH GIÁ TỔNG QUAN (cập nhật)

### 5.1. Điểm mạnh

1. **Kiến trúc rõ ràng**: Tách biệt backend/frontend, cấu trúc thư mục logic
2. **Database design tốt**: Quan hệ rõ ràng, có indexes, constraints
3. **Security cơ bản**: JWT, bcrypt, session management
4. **UI/UX hiện đại**: Tailwind CSS, Radix UI, responsive
5. **Type safety**: TypeScript cho frontend
6. **State management**: Zustand cho global state
7. **Data fetching**: React Query cho caching và synchronization
8. **File upload**: Tích hợp Cloudinary
9. **Transaction**: Sử dụng database transaction cho đơn hàng

### 5.2. Điểm yếu / Cần cải thiện

1. **Thiếu Admin Dashboard**: Backend có API nhưng frontend chưa có UI
2. **Payment chưa tích hợp thực tế**: Chỉ lưu phương thức, không gọi cổng thanh toán
3. **Thiếu User Profile**: Chưa có trang quản lý thông tin cá nhân
4. **Thiếu Search/Filter UI**: Backend có nhưng frontend chưa có
5. **Thiếu Testing**: Không có test nào
6. **Thiếu Documentation**: Không có API documentation
7. **Error handling & Validation**: Cần cải thiện validation ở backend và message rõ ràng hơn

### 5.3. Mức độ hoàn thiện

**Ước tính: ~60-65%**

- ✅ Core features (Auth, Books, Cart, Orders): **80%**
- ✅ UI/UX cơ bản: **70%**
- ❌ Admin features: **20%** (chỉ có backend)
- ❌ Payment integration: **30%** (chỉ có UI)
- ❌ Advanced features: **0%** (Wishlist, Tracking, etc.)
- ❌ Testing & Documentation: **0%**

---

## 6. KẾ HOẠCH PHÁT TRIỂN CHO NHÓM 3 NGƯỜI

### 6.1. Phân chia công việc đề xuất

**Người 1: Backend Developer + Admin Features**
- Hoàn thiện Admin API (CRUD đầy đủ cho Books, Orders, Users, Promos)
- Xây dựng Admin Dashboard frontend
- Tích hợp payment gateway (PayPal/Stripe/VNPay)
- Email notifications
- Security improvements (rate limiting, validation)

**Người 2: Frontend Developer + User Features**
- User Profile page
- Order History & Tracking page
- Search & Filter UI
- Wishlist feature
- UI/UX improvements
- Responsive optimization

**Người 3: Full-stack Developer + Advanced Features**
- Reviews enhancement
- Inventory management
- Performance optimization (caching, pagination)
- Testing (unit, integration)
- Documentation (API docs, README)
- Bug fixes và code refactoring

### 6.2. Roadmap ưu tiên

**Phase 1: Hoàn thiện Core Features (2-3 tuần)**
1. Admin Dashboard (quản lý sách, đơn hàng, users)
2. User Profile & Order History
3. Search & Filter UI
4. Payment Gateway Integration (ít nhất 1 phương thức)

**Phase 2: Advanced Features (2-3 tuần)**
1. Wishlist
2. Order Tracking
3. Email Notifications
4. Reviews Enhancement

**Phase 3: Polish & Optimization (1-2 tuần)**
1. Performance optimization
2. Testing
3. Documentation
4. Bug fixes

---

## 7. CÁC FILE QUAN TRỌNG CẦN XEM XÉT

### Backend:
- `backend/server.js` - Entry point
- `backend/models/associations.js` - Database relationships
- `backend/controllers/` - Business logic
- `backend/routes/` - API endpoints
- `backend/middleware/auth.js` - Authentication

### Frontend:
- `frontend/src/routes/index.tsx` - Route definitions
- `frontend/src/features/auth/useAuthStore.ts` - Auth state
- `frontend/src/features/cart/useCartStore.ts` - Cart state
- `frontend/src/api/` - API client functions
- `frontend/src/pages/` - Page components

---

## 8. KẾT LUẬN

Dự án **Bookstore E-commerce** đã có nền tảng vững chắc với các tính năng core đã được implement. Tuy nhiên, để trở thành một sản phẩm hoàn chỉnh, nhóm cần tập trung vào:

1. **Admin Dashboard** - Quan trọng nhất, cần có UI để quản lý hệ thống
2. **Payment Integration** - Cần tích hợp thực tế, không chỉ UI
3. **User Experience** - Profile, Order History, Search
4. **Testing & Documentation** - Để đảm bảo chất lượng code

Với 3 người, nếu phân chia công việc hợp lý và làm việc song song, có thể hoàn thiện dự án trong khoảng **6-8 tuần**.



