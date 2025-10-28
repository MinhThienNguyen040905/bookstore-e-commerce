// migrations/20251028120000-create-sessions-table.cjs
'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      session_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      refresh_token: {
        type: DataTypes.STRING(500), // TỐI ƯU: Dùng STRING thay TEXT
        allowNull: false
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.addIndex('Sessions', ['user_id']);
    await queryInterface.addIndex('Sessions', ['refresh_token']);
    await queryInterface.addIndex('Sessions', ['expires_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Sessions');
  }
};