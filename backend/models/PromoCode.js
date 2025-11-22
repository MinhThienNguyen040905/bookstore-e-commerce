import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PromoCode = sequelize.define('PromoCode', {
    promo_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    discount_percent: { type: DataTypes.DECIMAL(5, 2), allowNull: false, validate: { min: 0, max: 100 } },
    min_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    expiry_date: { type: DataTypes.DATE, allowNull: false },
});

export default PromoCode;