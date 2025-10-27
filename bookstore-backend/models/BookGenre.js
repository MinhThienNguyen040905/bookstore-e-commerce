import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Book from './Book.js';
import Genre from './Genre.js';

const BookGenre = sequelize.define('BookGenre', {}, { timestamps: false });

Book.belongsToMany(Genre, { through: BookGenre });
Genre.belongsToMany(Book, { through: BookGenre });

export default BookGenre;