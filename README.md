📚 Bookstore Ecommerce - Fullstack Project
Dự án website thương mại điện tử kinh doanh sách, được xây dựng theo kiến trúc Client-Server. Hệ thống bao gồm đầy đủ các tính năng cho người dùng (tìm kiếm, đặt hàng, đánh giá, thanh toán online) và trang quản trị (Admin dashboard) để quản lý sách, đơn hàng và thống kê doanh thu.

🚀 Công Nghệ Sử Dụng
Backend
Core: Node.js, Express.js

Database: MySQL, Sequelize ORM (có Migrations & Seeders).

Authentication: JWT (Access Token + Refresh Token), Cookie (HttpOnly).

File Storage: Cloudinary (lưu ảnh bìa sách, avatar).

Payment: Tích hợp cổng thanh toán VNPAY (Sandbox), COD.

Email Service: Nodemailer (Gửi OTP, xác nhận đơn hàng).

Automation: Node-cron (Tự động cập nhật trạng thái đơn hàng).

Frontend
Framework: React (Vite).

Language: TypeScript.

State Management: Context API / Redux (tuỳ config).

Styling: Tailwind CSS / CSS Modules.

Routing: React Router DOM.

HTTP Client: Axios (có Interceptors xử lý refresh token).

✨ Tính Năng Chính
👤 Người dùng (Customer)
Xác thực: Đăng ký, Đăng nhập, Quên mật khẩu (OTP qua Email), Đăng xuất.

Tìm kiếm & Lọc: Tìm kiếm theo từ khóa, lọc theo giá, thể loại, đánh giá, tác giả.

Sản phẩm: Xem chi tiết sách, xem đánh giá/bình luận.

Giỏ hàng: Thêm/sửa/xóa sản phẩm, đồng bộ giỏ hàng khi đăng nhập.

Thanh toán:

Thanh toán khi nhận hàng (COD).

Thanh toán online qua ví VNPAY.

Áp dụng mã giảm giá (Promo Code).

Cá nhân: Quản lý Profile, đổi Avatar, xem lịch sử đơn hàng, xem trạng thái vận chuyển (Timeline).

Đánh giá: Chỉ được đánh giá sách khi đã mua và đơn hàng thành công ("Verified Purchase").

Wishlist: Lưu sách yêu thích.

🛠 Quản trị viên (Admin)
Thống kê (Dashboard): Xem tổng doanh thu, số user, đơn hàng mới, biểu đồ doanh thu theo tháng.

Quản lý Sách: CRUD (Thêm, sửa, xóa) sách, upload ảnh bìa.

Quản lý Danh mục: Tác giả, Thể loại, Nhà xuất bản.

Quản lý Đơn hàng: Cập nhật trạng thái, hủy đơn.

Quản lý Mã giảm giá: Tạo mã coupon, set hạn sử dụng.

📂 Cấu Trúc Dự Án
Bash

bookstore-project/
├── backend/                # Mã nguồn Server (Node.js)
│   ├── certs/              # Chứa SSL Certificate (ca.pem) cho DB
│   ├── config/             # Cấu hình DB, VNPAY
│   ├── controllers/        # Logic xử lý chính (Books, Orders, Users...)
│   ├── middleware/         # Auth, Upload, Error Handling
│   ├── migrations/         # Database migrations (Sequelize)
│   ├── models/             # Định nghĩa Schema DB
│   ├── routes/             # Định tuyến API
│   ├── utils/              # Email sender, Scheduler
│   ├── server.js           # Entry point
│   └── .env                # Biến môi trường Backend
├── frontend/               # Mã nguồn Client (React)
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Các trang (Home, Cart, Login...)
│   │   ├── services/       # Gọi API (Axios config)
│   │   └── ...
│   └── .env                # Biến môi trường Frontend
└── README.md
⚙️ Cài Đặt & Chạy Dự Án
1. Yêu cầu tiên quyết
Node.js (v16 trở lên).

MySQL Server (XAMPP, Docker hoặc Cloud Database như Aiven/Railway).

Git.

2. Cài đặt Backend
Di chuyển vào thư mục backend:

Bash

cd backend
Cài đặt các gói phụ thuộc:

Bash

npm install
Cấu hình biến môi trường: Tạo file .env trong thư mục backend/ và điền các thông tin sau (dựa trên file mẫu):

Đoạn mã

PORT=3000
# Database Config
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=bookstore
SSL_CA_PATH=./certs/ca.pem  # Nếu dùng DB Cloud yêu cầu SSL

# JWT Config
JWT_SECRET=your_super_secret_key

# Cloudinary (Ảnh)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client URL (Để CORS và Redirect)
CLIENT_URL=http://localhost:5173

# VNPAY Config (Lấy từ Sandbox VNPAY)
VNP_TMNCODE=your_tmn_code
VNP_HASHSECRET=your_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURNURL=http://localhost:3000/api/payment/vnpay_return
Khởi tạo Database: Chạy migration để tạo bảng trong MySQL:

Bash

npx sequelize-cli db:migrate
Chạy Server:

Bash

npm start
# Hoặc chế độ dev (tự restart khi sửa code)
npm run dev
Server sẽ chạy tại http://localhost:3000.

3. Cài đặt Frontend
Mở terminal mới, di chuyển vào thư mục frontend:

Bash

cd frontend
Cài đặt các gói phụ thuộc:

Bash

npm install
Cấu hình biến môi trường: Tạo file .env (hoặc .env.local) trong thư mục frontend/:

Đoạn mã

VITE_API_URL=http://localhost:3000/api
Chạy Client:

Bash

npm run dev
Truy cập website tại http://localhost:5173.

🧪 Tài Liệu API
Chi tiết về các endpoints xem tại file API_DOCUMENTATION.md.

Một số API chính:

GET /api/books: Lấy danh sách sách (Filter, Search, Sort).

POST /api/users/login: Đăng nhập.

POST /api/payment/create_payment_url: Tạo link thanh toán VNPAY.

POST /api/wishlist/toggle: Thêm/Xóa wishlist.

📝 Lưu Ý Quan Trọng
SSL Database: Nếu bạn sử dụng database cloud (như Aiven trong code mẫu), hãy đảm bảo file backend/certs/ca.pem tồn tại và đúng đường dẫn trong .env.

Order Scheduler: Backend có chạy một cron job (utils/orderScheduler.js) mỗi giờ để tự động cập nhật trạng thái đơn hàng (Processing -> Shipped -> Delivered) nhằm mô phỏng quy trình thực tế.

Bảo mật: Không commit file .env lên Github công khai để tránh lộ Key.

🤝 Đóng Góp (Contributing)
Mọi đóng góp đều được hoan nghênh. Vui lòng tạo Pull Request hoặc mở Issue để thảo luận.