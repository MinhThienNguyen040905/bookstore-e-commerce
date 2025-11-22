// migrations/20251105142057-change-refresh-token-to-varchar.cjs
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Bắt đầu sửa refresh_token...');

    // 1. XÓA INDEX ĐÚNG TÊN (theo SHOW INDEX)
    const indexesToRemove = [
      'sessions_user_id',      // ← TỒN TẠI
      'sessions_refresh_token',
      'sessions_expires_at'
    ];

    for (const indexName of indexesToRemove) {
      try {
        await queryInterface.removeIndex('Sessions', indexName);
        console.log(`Đã xóa index: ${indexName}`);
      } catch (err) {
        console.log(`Không tìm thấy index ${indexName} → bỏ qua`);
      }
    }

    // 2. Đổi cột
    await queryInterface.changeColumn('Sessions', 'refresh_token', {
      type: Sequelize.STRING(500),
      allowNull: false
    });

    // 3. Tạo lại index
    await queryInterface.addIndex('Sessions', ['user_id'], {
      name: 'sessions_user_id'
    });
    await queryInterface.addIndex('Sessions', ['refresh_token'], {
      name: 'sessions_refresh_token'
    });
    await queryInterface.addIndex('Sessions', ['expires_at'], {
      name: 'sessions_expires_at'
    });

    console.log('HOÀN TẤT! Không còn lỗi duplicate.');
  },

  async down(queryInterface) {
    const indexes = ['sessions_user_id', 'sessions_refresh_token', 'sessions_expires_at'];
    for (const idx of indexes) {
      try { await queryInterface.removeIndex('Sessions', idx); } catch (err) { }
    }
    await queryInterface.changeColumn('Sessions', 'refresh_token', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  }
};