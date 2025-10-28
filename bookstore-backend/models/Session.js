// models/Session.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Session = sequelize.define('Session', {
    session_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        },
        onDelete: 'CASCADE' // Xóa session nếu user bị xóa
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'Sessions',
    timestamps: true, // createdAt, updatedAt
    indexes: [
        { fields: ['user_id'] },
        { fields: ['refresh_token'] },
        { fields: ['expires_at'] } // Dễ query session hết hạn
    ]
});

// Quan hệ
User.hasMany(Session, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Session;