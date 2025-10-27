import { Sequelize } from 'sequelize';
import fs from 'fs';
import 'dotenv/config';

const dialectOptions = {};
if (process.env.SSL_CA_PATH) {
    // nếu có, đọc file CA; nếu không có env thì không thêm ssl (tránh lỗi)
    dialectOptions.ssl = { ca: fs.readFileSync(process.env.SSL_CA_PATH) };
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions,
    logging: false,
});

export default sequelize;