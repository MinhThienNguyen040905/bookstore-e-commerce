import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Book from './Book.js';

const CartItem = sequelize.define('CartItem', {
    quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
}, {
    indexes: [
        { unique: true, fields: ['user_id', 'book_id'] }
    ]
});

User.hasMany(CartItem, { foreignKey: 'user_id' });
CartItem.belongsTo(User, { foreignKey: 'user_id' });
Book.hasMany(CartItem, { foreignKey: 'book_id' });
CartItem.belongsTo(Book, { foreignKey: 'book_id' });

export default CartItem;