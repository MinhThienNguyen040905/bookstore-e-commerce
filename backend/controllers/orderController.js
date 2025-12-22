// controllers/orderController.js
import { Op } from 'sequelize';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Book from '../models/Book.js';
import PromoCode from '../models/PromoCode.js';
import CartItem from '../models/CartItem.js';
import User from '../models/User.js';
import sequelize from '../config/db.js';
import { ORDER_STATUS, ORDER_STATUS_LIST } from '../constants/orderStatus.js';

// Timeline configuration
const TIMELINE_STEPS = [
    { status: 'processing', title: 'Đang xử lý', description: 'Đơn hàng đang được xác nhận' },
    { status: 'shipped', title: 'Đang vận chuyển', description: 'Đơn hàng đang được giao' },
    { status: 'delivered', title: 'Đã giao hàng', description: 'Đơn hàng đã đến tay bạn' }
];

const STATUS_OFFSETS_DAYS = {
    processing: 0,
    shipped: 2,
    delivered: 4
};

// Helper function to build status history for timeline
const buildStatusHistory = (currentStatus, orderDate) => {
    if (!orderDate) return [];
    const baseDate = new Date(orderDate);

    // Special case: cancelled orders
    if (currentStatus === ORDER_STATUS.CANCELLED) {
        return [
            {
                status: ORDER_STATUS.CANCELLED,
                title: 'Đơn hàng đã bị hủy',
                description: 'Liên hệ CSKH để biết thêm chi tiết',
                completedAt: baseDate,
                isCompleted: true
            }
        ];
    }

    // Find current step index
    const currentIndex = TIMELINE_STEPS.findIndex(step => step.status === currentStatus);
    
    // Build timeline: show all steps up to current status
    return TIMELINE_STEPS.map((step, index) => {
        const estimatedDate = new Date(baseDate);
        estimatedDate.setDate(estimatedDate.getDate() + (STATUS_OFFSETS_DAYS[step.status] || 0));
        
        return {
            status: step.status,
            title: step.title,
            description: step.description,
            completedAt: estimatedDate,
            isCompleted: index <= currentIndex
        };
    });
};

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

        // Kiểm tra và lock stock để tránh race condition
        let total_price = 0;
        for (const item of cartItems) {
            // Lock row để tránh race condition khi nhiều người cùng đặt
            const book = await Book.findByPk(item.book_id, {
                lock: transaction.LOCK.UPDATE,
                transaction
            });

            if (!book || book.stock < item.quantity) {
                await transaction.rollback();
                return res.error(`Số lượng không đủ cho sách: ${book?.title || item.Book?.title || 'Không xác định'}`, 400);
            }
            total_price += item.quantity * book.price;
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
            status: ORDER_STATUS.PROCESSING,
            address,
            phone
        }, { transaction });

        // Tạo chi tiết đơn hàng + giảm stock
        for (const item of cartItems) {
            // Lấy lại book với lock để đảm bảo tính nhất quán
            const book = await Book.findByPk(item.book_id, {
                lock: transaction.LOCK.UPDATE,
                transaction
            });

            await OrderItem.create({
                order_id: order.order_id,
                book_id: item.book_id,
                quantity: item.quantity,
                price: book.price,
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

// Get user's orders with timeline tracking (for frontend)
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.user_id },
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Book,
                            attributes: ['book_id', 'title', 'cover_image', 'price']
                        }
                    ]
                },
                { model: PromoCode, attributes: ['code', 'discount_percent'] }
            ],
            order: [['order_date', 'DESC']]
        });

        // Transform data with timeline
        const ordersWithTimeline = orders.map(order => ({
            order_id: order.order_id,
            total_price: order.total_price,
            status: order.status,
            order_date: order.order_date,
            payment_method: order.payment_method,
            address: order.address,
            phone: order.phone,
            promo: order.PromoCode ? {
                code: order.PromoCode.code,
                discount_percent: order.PromoCode.discount_percent
            } : null,
            order_items: (order.OrderItems || []).map(item => ({
                order_item_id: item.order_item_id,
                quantity: item.quantity,
                price: item.price,
                book: item.Book ? {
                    book_id: item.Book.book_id,
                    title: item.Book.title,
                    cover_image: item.Book.cover_image,
                    price: item.Book.price
                } : null
            })),
            status_history: buildStatusHistory(order.status, order.order_date)
        }));

        res.success(ordersWithTimeline, 'Lấy danh sách đơn hàng với timeline thành công');
    } catch (err) {
        console.error('Error in getMyOrders:', err);
        res.error('Lỗi server', 500);
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: OrderItem, include: [Book] },
                { model: PromoCode, attributes: ['code', 'discount_percent'] },
                { model: User, attributes: ['user_id', 'name', 'email'] }
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

    if (!ORDER_STATUS_LIST.includes(status)) {
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

export default { createOrder, getOrders, getMyOrders, getAllOrders, updateOrderStatus };