const { Op } = require('sequelize');
const PromoCode = require('../models/PromoCode');

// Thêm mã khuyến mãi (admin)
exports.addPromo = async (req, res) => {
    const { code, discount_percent, min_amount, expiry_date } = req.body;
    try {
        const promo = await PromoCode.create({
            code,
            discount_percent,
            min_amount,
            expiry_date,
        });
        res.status(201).json(promo);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Lấy danh sách mã khuyến mãi (còn hiệu lực)
exports.getPromos = async (req, res) => {
    try {
        const promos = await PromoCode.findAll({
            where: { expiry_date: { [Op.gte]: new Date() } },
        });
        res.json(promos);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Lấy tất cả mã khuyến mãi (admin)
exports.getAllPromos = async (req, res) => {
    try {
        const promos = await PromoCode.findAll();
        res.json(promos);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};