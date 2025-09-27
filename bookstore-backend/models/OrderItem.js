const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');
const Book = require('./Book');

const OrderItem = sequelize.define('OrderItem', {
    order_item_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
});

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
Book.hasMany(OrderItem);
OrderItem.belongsTo(Book);

module.exports = OrderItem;