import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Book from './Book.js';
import Author from './Author.js';

const BookAuthor = sequelize.define('BookAuthor', {}, { timestamps: false });

Book.belongsToMany(Author, { through: BookAuthor });
Author.belongsToMany(Book, { through: BookAuthor });

export default BookAuthor;