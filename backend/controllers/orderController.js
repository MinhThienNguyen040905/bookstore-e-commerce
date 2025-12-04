// controllers/orderController.js
import { Op } from 'sequelize';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Book from '../models/Book.js';
import PromoCode from '../models/PromoCode.js';
import CartItem from '../models/CartItem.js';
import sequelize from '../config/db.js';

const createOrder = async (req, res) => {
    const { promo_code, payment_method, address, phone } = req.body;
    const transaction = await sequelize.transaction();

    try {
        // Validate required fields
        if (!payment_method) return res.error('Vui lòng chọn phương thức thanh toán', 400);
        if (!address || !phone) return res.error('Vui lòng cung cấp địa chỉ và số điện thoại giao hàng', 400);

        const cartItems = await CartItem.findAll({
            where: { user_id: req.user.user_id },
            include: [Book],
        });

        if (!cartItems.length) {
            await transaction.rollback();
            return res.error('Giỏ hàng trống', 400);
        }

        let total_price = 0;
        for (const item of cartItems) {
            if (item.Book.stock < item.quantity) {
                await transaction.rollback();
                return res.error(`Số lượng không đủ cho sách: ${item.Book.title}`, 400);
            }
            total_price += item.quantity * item.Book.price;
        }

        let promo_id = null;
        if (promo_code) {
            const promo = await PromoCode.findOne({
                where: {
                    code: promo_code.toUpperCase(),
                    expiry_date: { [Op.gte]: new Date() }
                }
            });

            if (!promo) {
                await transaction.rollback();
                return res.error('Mã khuyến mãi không hợp lệ hoặc đã hết hạn', 400);
            }
            if (total_price < promo.min_amount) {
                await transaction.rollback();
                return res.error(`Đơn hàng tối thiểu ${promo.min_amount.toLocaleString()}₫ để dùng mã này`, 400);
            }

            total_price = total_price - (total_price * promo.discount_percent / 100);
            promo_id = promo.promo_id;
        }

        // Tạo đơn hàng (có address + phone)
        const order = await Order.create({
            user_id: req.user.user_id,
            promo_id,
            total_price: Math.round(total_price),
            payment_method,
            status: 'processing',
            address,
            phone
        }, { transaction });

        // Tạo chi tiết đơn hàng + giảm stock
        for (const item of cartItems) {
            await OrderItem.create({
                order_id: order.order_id,
                book_id: item.book_id,
                quantity: item.quantity,
                price: item.Book.price,
            }, { transaction });

            await Book.decrement('stock', {
                by: item.quantity,
                where: { book_id: item.book_id },
                transaction
            });
        }

        // Xóa giỏ hàng
        await CartItem.destroy({ where: { user_id: req.user.user_id }, transaction });
        await transaction.commit();

        // Trả về đơn hàng vừa tạo
        const newOrder = await Order.findByPk(order.order_id, {
            include: [
                { model: OrderItem, include: [Book] },
                { model: PromoCode, attributes: ['code', 'discount_percent'] }
            ]
        });

        res.success(newOrder, 'Đặt hàng thành công!', 201);

    } catch (err) {
        await transaction.rollback();
        console.error('Lỗi tạo đơn hàng:', err);
        res.error('Lỗi server khi đặt hàng', 500);
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.user_id },
            include: [
                { model: OrderItem, include: [Book] },
                { model: PromoCode, attributes: ['code', 'discount_percent'] }
            ],
            order: [['order_date', 'DESC']]
        });
        res.success(orders, 'Lấy danh sách đơn hàng thành công');
    } catch (err) {
        console.error(err);
        res.error('Lỗi server', 500);
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: OrderItem, include: [Book] },
                { model: PromoCode, attributes: ['code', 'discount_percent'] },
                { model: req.models?.User || (await import('../models/User.js')).default, attributes: ['user_id', 'name', 'email'] }
            ],
            order: [['order_date', 'DESC']]
        });
        res.success(orders, 'Lấy tất cả đơn hàng thành công');
    } catch (err) {
        console.error(err);
        res.error('Lỗi server', 500);
    }
};

const updateOrderStatus = async (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;

    if (!['processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return res.error('Trạng thái không hợp lệ', 400);
    }

    try {
        const order = await Order.findByPk(order_id);
        if (!order) return res.error('Không tìm thấy đơn hàng', 404);

        order.status = status;
        await order.save();

        res.success(order, 'Cập nhật trạng thái thành công');
    } catch (err) {
        console.error(err);
        res.error('Lỗi server', 500);
    }
};

export default { createOrder, getOrders, getAllOrders, updateOrderStatus };