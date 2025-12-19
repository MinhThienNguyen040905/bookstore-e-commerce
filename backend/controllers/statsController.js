// controllers/statsController.js
import User from '../models/User.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Book from '../models/Book.js';
import { Op } from 'sequelize';

const getStats = async (req, res) => {
    try {
        // Validation: Đảm bảo user đã authenticated (middleware đã check, nhưng thêm safety check)
        if (!req.user || req.user.role !== 'admin') {
            return res.error('Chỉ admin mới có quyền xem thống kê', 403);
        }

        // 1. Total Users (chỉ customer, không tính admin)
        const totalUsers = await User.count({
            where: { role: 'customer' }
        });

        // 2. Total Orders
        const totalOrders = await Order.count();

        // 3. Total Revenue (chỉ đơn hàng delivered/shipped)
        const revenueResult = await Order.sum('total_price', {
            where: {
                status: {
                    [Op.in]: ['delivered', 'shipped']
                }
            }
        });
        const totalRevenue = revenueResult || 0;

        // 4. Recent Orders (5 đơn gần nhất)
        const recentOrders = await Order.findAll({
            limit: 5,
            order: [['order_date', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'name', 'email']
                },
                {
                    model: OrderItem,
                    include: [{ model: Book, attributes: ['title', 'cover_image'] }]
                }
            ]
        });

        // Fallback: Nếu không có data → trả về 0
        if (totalUsers === 0 && totalOrders === 0) {
            return res.success({
                totalUsers: 0,
                totalOrders: 0,
                totalRevenue: 0,
                recentOrders: []
            }, 'Database trống - Chưa có dữ liệu');
        }

        res.success({
            totalUsers,
            totalOrders,
            totalRevenue: parseFloat(totalRevenue),
            recentOrders
        }, 'Lấy thống kê thành công');

    } catch (err) {
        console.error('Error in getStats:', err);
        res.error('Lỗi server khi lấy thống kê', 500);
    }
};

export default { getStats };

