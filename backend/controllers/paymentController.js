// controllers/paymentController.js
import moment from 'moment';
import qs from 'qs';
import crypto from 'crypto';
import vnpayConfig from '../config/vnpay.js';
import Order from '../models/Order.js';
import CartItem from '../models/CartItem.js';
import sequelize from '../config/db.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';

/**
 * Tạo URL thanh toán VNPay
 * @route POST /api/payment/create_payment_url
 */
const createPaymentUrl = async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        if (!orderId || !amount) {
            return res.error('Thiếu thông tin orderId hoặc amount', 400);
        }

        // Lấy IP address từ request
        let ipAddr = req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress ||
                     req.connection.socket?.remoteAddress ||
                     '127.0.0.1';

        // Nếu là IPv6 localhost, chuyển sang IPv4
        if (ipAddr === '::1' || ipAddr === '::ffff:127.0.0.1') {
            ipAddr = '127.0.0.1';
        }

        // Kiểm tra đơn hàng có tồn tại không
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.error('Không tìm thấy đơn hàng', 404);
        }

        // Kiểm tra đơn hàng có thuộc về user hiện tại không
        if (order.user_id !== req.user.user_id) {
            return res.error('Bạn không có quyền truy cập đơn hàng này', 403);
        }

        const createDate = moment().format('YYYYMMDDHHmmss');
        const vnpAmount = Math.round(amount * 100); // VNPay yêu cầu số tiền nhân 100

        // Tạo params object
        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnpayConfig.vnp_TmnCode,
            vnp_Amount: vnpAmount,
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId.toString(),
            vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
            vnp_OrderType: 'other',
            vnp_Locale: 'vn',
            vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate
        };

        // Sắp xếp params theo thứ tự alphabet (REQUIRED)
        vnp_Params = sortObject(vnp_Params);

        // Tạo chuỗi query string để sign
        const signData = qs.stringify(vnp_Params, { encode: false });

        // Tạo chữ ký HMAC SHA512
        const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;

        // Tạo URL thanh toán
        const paymentUrl = vnpayConfig.vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });

        return res.success({ paymentUrl }, 'Tạo URL thanh toán thành công');

    } catch (err) {
        console.error('Lỗi tạo URL thanh toán VNPay:', err);
        return res.error('Lỗi server khi tạo URL thanh toán', 500);
    }
};

/**
 * Xử lý callback từ VNPay sau khi thanh toán
 * @route GET /api/payment/vnpay_return
 */
const vnpayReturn = async (req, res) => {
    try {
        let vnp_Params = req.query;

        // Lấy secure hash từ VNPay trả về
        const secureHash = vnp_Params['vnp_SecureHash'];

        // Xóa các trường không cần thiết để verify signature
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        // Sắp xếp params theo alphabet
        vnp_Params = sortObject(vnp_Params);

        // Tạo chuỗi query string để verify
        const signData = qs.stringify(vnp_Params, { encode: false });

        // Verify chữ ký
        const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        // Lấy thông tin từ params
        const orderId = vnp_Params['vnp_TxnRef'];
        const responseCode = vnp_Params['vnp_ResponseCode'];
        const transactionNo = vnp_Params['vnp_TransactionNo'];
        const amount = vnp_Params['vnp_Amount'];

        // Kiểm tra chữ ký có hợp lệ không
        if (secureHash !== signed) {
            console.error('Chữ ký không hợp lệ');
            return res.redirect(`http://localhost:5173/order-failure?code=97&message=Invalid signature`);
        }

        const transaction = await sequelize.transaction();

        try {
            // Tìm đơn hàng
            const order = await Order.findByPk(orderId, { transaction });

            if (!order) {
                await transaction.rollback();
                return res.redirect(`http://localhost:5173/order-failure?code=01&message=Order not found`);
            }

            // Kiểm tra responseCode từ VNPay
            if (responseCode === '00') {
                // Giao dịch thành công
                order.status = ORDER_STATUS.PROCESSING;
                order.payment_status = 'paid'; // Thêm trường này nếu có trong model
                order.vnpay_transaction_no = transactionNo; // Lưu mã giao dịch nếu có field
                await order.save({ transaction });

                // Xóa giỏ hàng (nếu chưa xóa)
                await CartItem.destroy({
                    where: { user_id: order.user_id },
                    transaction
                });

                await transaction.commit();

                // Redirect về trang thành công
                return res.redirect(`http://localhost:5173/order-success?code=${responseCode}&orderId=${orderId}&transactionNo=${transactionNo}`);

            } else {
                // Giao dịch thất bại
                // Không cập nhật trạng thái đơn hàng, giữ nguyên hoặc đánh dấu là failed
                await transaction.rollback();

                // Redirect về trang thất bại
                return res.redirect(`http://localhost:5173/order-failure?code=${responseCode}&orderId=${orderId}`);
            }

        } catch (err) {
            if (!transaction.finished) {
                await transaction.rollback();
            }
            console.error('Lỗi xử lý callback VNPay:', err);
            return res.redirect(`http://localhost:5173/order-failure?code=99&message=Server error`);
        }

    } catch (err) {
        console.error('Lỗi xử lý VNPay return:', err);
        return res.redirect(`http://localhost:5173/order-failure?code=99&message=Server error`);
    }
};

/**
 * Helper function: Sắp xếp object theo key (alphabet)
 */
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    });
    return sorted;
}

export default {
    createPaymentUrl,
    vnpayReturn
};

