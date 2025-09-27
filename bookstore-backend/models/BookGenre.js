const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Book = require('./Book');
const Genre = require('./Genre');

const BookGenre = sequelize.define('BookGenre', {}, { timestamps: false });

Book.belongsToMany(Genre, { through: BookGenre });
Genre.belongsToMany(Book, { through: BookGenre });

module.exports = BookGenre;