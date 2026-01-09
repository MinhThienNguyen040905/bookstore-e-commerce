import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path'; // <--- BẮT BUỘC PHẢI IMPORT CÁI NÀY
import 'dotenv/config';

const dialectOptions = {};

if (process.env.SSL_CA_PATH) {
    // Sửa đoạn này: Dùng process.cwd() để lấy đường dẫn gốc chính xác trên Vercel
    const certPath = path.join(process.cwd(), process.env.SSL_CA_PATH);

    // Kiểm tra xem file có tồn tại không để tránh crash app nếu file thiếu
    if (fs.existsSync(certPath)) {
        dialectOptions.ssl = { ca: fs.readFileSync(certPath) };
        console.log("✅ Đã load thành công chứng chỉ SSL từ:", certPath);
    } else {
        console.warn(`⚠️ CẢNH BÁO: Không tìm thấy file chứng chỉ tại ${certPath}. Kết nối DB sẽ không dùng SSL.`);
        // Tùy chọn: Có thể tắt SSL hoặc để nó tự fail nếu bắt buộc phải có SSL
        // dialectOptions.ssl = { rejectUnauthorized: false }; 
    }
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions,
    logging: false,
});

export default sequelize;