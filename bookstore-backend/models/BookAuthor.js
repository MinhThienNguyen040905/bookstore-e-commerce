const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Book = require('./Book');
const Author = require('./Author');

const BookAuthor = sequelize.define('BookAuthor', {}, { timestamps: false });

Book.belongsToMany(Author, { through: BookAuthor });
Author.belongsToMany(Book, { through: BookAuthor });

module.exports = BookAuthor;