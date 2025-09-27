const { Op } = require('sequelize');
const Review = require('../models/Review');
const Book = require('../models/Book');
const User = require('../models/User');

// Thêm đánh giá
exports.addReview = async (req, res) => {
    const { book_id, rating, comment } = req.body;
    try {
        // Kiểm tra sách và user
        const book = await Book.findByPk(book_id);
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        const user = await User.findByPk(req.user.user_id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Kiểm tra đã đánh giá chưa
        const existingReview = await Review.findOne({ where: { user_id: req.user.user_id, book_id } });
        if (existingReview) return res.status(400).json({ msg: 'You have already reviewed this book' });

        const review = await Review.create({
            user_id: req.user.user_id,
            book_id,
            rating,
            comment,
        });
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Lấy đánh giá theo sách
exports.getReviewsByBook = async (req, res) => {
    const { book_id } = req.params;
    try {
        const reviews = await Review.findAll({
            where: { book_id },
            include: [{ model: User, attributes: ['user_id', 'name'] }],
        });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Lấy tất cả đánh giá (admin)
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                { model: User, attributes: ['user_id', 'name'] },
                { model: Book, attributes: ['book_id', 'title'] },
            ],
        });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};