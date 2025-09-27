const { Op } = require('sequelize');
const CartItem = require('../models/CartItem');
const Book = require('../models/Book');
const User = require('../models/User');

// Thêm sách vào giỏ hàng
exports.addToCart = async (req, res) => {
    const { book_id, quantity } = req.body;
    try {
        // Kiểm tra sách tồn tại
        const book = await Book.findByPk(book_id);
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        if (book.stock < quantity) return res.status(400).json({ msg: 'Insufficient stock' });

        // Kiểm tra user
        const user = await User.findByPk(req.user.user_id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Thêm hoặc cập nhật item trong giỏ
        let cartItem = await CartItem.findOne({ where: { user_id: req.user.user_id, book_id } });
        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({ user_id: req.user.user_id, book_id, quantity });
        }

        res.status(201).json(cartItem);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Cập nhật số lượng item trong giỏ
exports.updateCart = async (req, res) => {
    const { book_id, quantity } = req.body;
    try {
        const cartItem = await CartItem.findOne({ where: { user_id: req.user.user_id, book_id } });
        if (!cartItem) return res.status(404).json({ msg: 'Cart item not found' });

        // Kiểm tra stock
        const book = await Book.findByPk(book_id);
        if (book.stock < quantity) return res.status(400).json({ msg: 'Insufficient stock' });

        if (quantity <= 0) {
            await cartItem.destroy();
            return res.json({ msg: 'Item removed from cart' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();
        res.json(cartItem);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Xóa item khỏi giỏ
exports.removeFromCart = async (req, res) => {
    const { book_id } = req.params;
    try {
        const cartItem = await CartItem.findOne({ where: { user_id: req.user.user_id, book_id } });
        if (!cartItem) return res.status(404).json({ msg: 'Cart item not found' });

        await cartItem.destroy();
        res.json({ msg: 'Item removed from cart' });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Lấy giỏ hàng của user
exports.getCart = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { user_id: req.user.user_id },
            include: [{ model: Book, attributes: ['book_id', 'title', 'price', 'cover_image'] }],
        });
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};