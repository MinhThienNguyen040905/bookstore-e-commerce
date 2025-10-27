import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './Order.js';
import Book from './Book.js';

const OrderItem = sequelize.define('OrderItem', {
    order_item_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
});

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
Book.hasMany(OrderItem);
OrderItem.belongsTo(Book);

export default OrderItem;