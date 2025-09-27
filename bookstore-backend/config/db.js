const { Sequelize } = require('sequelize');
const fs = require('fs');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            ca: fs.readFileSync(process.env.SSL_CA_PATH), // Đọc file ca.pem
        },
    },
    logging: false,
});

module.exports = sequelize;