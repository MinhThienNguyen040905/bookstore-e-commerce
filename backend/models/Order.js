import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Order = sequelize.define('Order', {
    order_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    status: { type: DataTypes.ENUM('processing', 'shipped', 'cancelled'), defaultValue: 'processing', allowNull: false },
    order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    payment_method: { type: DataTypes.STRING(50), allowNull: false },
});


export default Order;