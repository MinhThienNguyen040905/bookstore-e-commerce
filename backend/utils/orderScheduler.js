// utils/orderScheduler.js
import cron from 'node-cron';
import { Op } from 'sequelize';
import Order from '../models/Order.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';

// Cấu hình thời gian giả lập (giống trong file controller cũ của bạn)
const DAYS_TO_SHIP = 2;      // Sau 2 ngày -> Shipped
const DAYS_TO_DELIVER = 4;   // Sau 4 ngày -> Delivered

const runOrderScheduler = () => {
    // Lên lịch: Chạy mỗi 1 tiếng (0 phút của mỗi giờ)
    // Ký hiệu '0 * * * *' nghĩa là chạy mỗi giờ. Nếu muốn test nhanh mỗi phút dùng '* * * * *'
    cron.schedule('* * * * *', async () => {
        console.log('--- ⏳ Bắt đầu quét đơn hàng tự động... ---');

        try {
            const now = new Date();

            // 1. TỰ ĐỘNG CHUYỂN: PROCESSING -> SHIPPED
            // Tìm các đơn đang 'processing' mà đã đặt quá 2 ngày
            const processingDeadline = new Date(now);
            processingDeadline.setDate(processingDeadline.getDate() - DAYS_TO_SHIP);

            const ordersToShip = await Order.findAll({
                where: {
                    status: ORDER_STATUS.PROCESSING,
                    order_date: { [Op.lte]: processingDeadline } // order_date <= (now - 2 ngày)
                }
            });

            if (ordersToShip.length > 0) {
                // Cập nhật hàng loạt
                const ids = ordersToShip.map(o => o.order_id);
                await Order.update(
                    { status: ORDER_STATUS.SHIPPED },
                    { where: { order_id: ids } }
                );
                console.log(`✅ Đã chuyển ${ordersToShip.length} đơn sang trạng thái SHIPPED`);
            }

            // 2. TỰ ĐỘNG CHUYỂN: SHIPPED -> DELIVERED
            // Tìm các đơn đang 'shipped' mà đã đặt quá 4 ngày
            const deliveryDeadline = new Date(now);
            deliveryDeadline.setDate(deliveryDeadline.getDate() - DAYS_TO_DELIVER);

            const ordersToDeliver = await Order.findAll({
                where: {
                    status: ORDER_STATUS.SHIPPED,
                    order_date: { [Op.lte]: deliveryDeadline } // order_date <= (now - 4 ngày)
                }
            });

            if (ordersToDeliver.length > 0) {
                const ids = ordersToDeliver.map(o => o.order_id);
                await Order.update(
                    { status: ORDER_STATUS.DELIVERED },
                    { where: { order_id: ids } }
                );
                console.log(`✅ Đã chuyển ${ordersToDeliver.length} đơn sang trạng thái DELIVERED`);
            }

        } catch (err) {
            console.error('❌ Lỗi khi chạy Scheduler:', err);
        }
    });

    console.log('✅ Đã kích hoạt Order Scheduler (chạy ngầm)');
};

export default runOrderScheduler;