import { Op } from 'sequelize';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Book from '../models/Book.js';
import PromoCode from '../models/PromoCode.js';
import CartItem from '../models/CartItem.js';
import sequelize from '../config/db.js';
import User from '../models/User.js';

// Tạo đơn hàng từ giỏ hàng
const createOrder = async (req, res) => {
    const { promo_code, payment_method } = req.body;
    const transaction = await sequelize.transaction();
    try {
        // Lấy giỏ hàng
        const cartItems = await CartItem.findAll({
            where: { user_id: req.user.user_id },
            include: [Book],
        });
        if (!cartItems.length) {
            await transaction.rollback();
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        // Tính tổng giá
        let total_price = 0;
        for (const item of cartItems) {
            if (item.Book.stock < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({ msg: `Insufficient stock for ${item.Book.title}` });
            }
            total_price += item.quantity * item.Book.price;
        }

        // Áp dụng mã khuyến mãi
        let promo_id = null;
        if (promo_code) {
            const promo = await PromoCode.findOne({ where: { code: promo_code, expiry_date: { [Op.gte]: new Date() } } });
            if (!promo) {
                await transaction.rollback();
                return res.status(400).json({ msg: 'Invalid or expired promo code' });
            }
            if (total_price < promo.min_amount) {
                await transaction.rollback();
                return res.status(400).json({ msg: `Minimum order amount is ${promo.min_amount}` });
            }
            total_price -= (total_price * promo.discount_percent) / 100;
            promo_id = promo.promo_id;
        }

        // Tạo đơn hàng
        const order = await Order.create(
            {
                user_id: req.user.user_id,
                promo_id,
                total_price,
                payment_method,
                status: 'processing',
            },
            { transaction }
        );

        // Tạo OrderItems và cập nhật stock
        for (const item of cartItems) {
            await OrderItem.create(
                {
                    order_id: order.order_id,
                    book_id: item.book_id,
                    quantity: item.quantity,
                    price: item.Book.price,
                },
                { transaction }
            );
            await Book.update(
                { stock: item.Book.stock - item.quantity },
                { where: { book_id: item.book_id }, transaction }
            );
        }

        // Xóa giỏ hàng
        await CartItem.destroy({ where: { user_id: req.user.user_id }, transaction });

        await transaction.commit();
        res.status(201).json(order);
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ err: err.message });
    }
};

// Lấy danh sách đơn hàng của user
const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.user_id },
            include: [
                { model: OrderItem, include: [Book] },
                { model: PromoCode, attributes: ['code', 'discount_percent'] },
            ],
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Lấy tất cả đơn hàng (admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: OrderItem, include: [Book] },
                { model: PromoCode, attributes: ['code', 'discount_percent'] },
                { model: User, attributes: ['user_id', 'name', 'email'] },
            ],
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Cập nhật trạng thái đơn hàng (admin)
const updateOrderStatus = async (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findByPk(order_id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

export default { createOrder, getOrders, getAllOrders, updateOrderStatus };