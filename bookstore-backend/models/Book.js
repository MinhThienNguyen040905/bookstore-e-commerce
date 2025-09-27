const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Book = sequelize.define('Book', {
    book_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: DataTypes.TEXT,
    publisher_id: { type: DataTypes.INTEGER, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false, validate: { min: 0 } },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    cover_image: DataTypes.STRING(255),  // URL từ Cloudinary
    release_date: DataTypes.DATE,
    isbn: { type: DataTypes.STRING(20), unique: true, allowNull: false },
});

module.exports = Book;