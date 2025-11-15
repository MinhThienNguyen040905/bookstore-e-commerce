import { Op } from 'sequelize';
import sequelize from '../config/db.js';
import Book from '../models/Book.js';
import Author from '../models/Author.js';
import Genre from '../models/Genre.js';
import Publisher from '../models/Publisher.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import cloudinary from '../cloudinary.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // Tạm lưu local trước khi upload Cloudinary
const uploadCover = upload.single('cover_image');

// Add book (with authors, genres)
const addBook = async (req, res) => {
    const { title, description, publisher_id, stock, price, release_date, isbn, authors, genres } = req.body;
    try {
        let cover_image = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            cover_image = result.secure_url;
        }
        const book = await Book.create({ title, description, publisher_id, stock, price, cover_image, release_date, isbn });

        if (authors) {
            const authorInstances = await Author.findAll({ where: { author_id: authors.split(',') } });
            await book.addAuthors(authorInstances);
        }
        if (genres) {
            const genreInstances = await Genre.findAll({ where: { genre_id: genres.split(',') } });
            await book.addGenres(genreInstances);
        }

        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ err: err.message });
    }
};

// Get all books (with search/filter)
const getBooks = async (req, res) => {
    const { title, author, genre, min_price, max_price, sort } = req.query;
    let where = {};
    if (title) where.title = { [Op.like]: `%${title}%` };
    // Thêm logic cho author, genre (JOIN), price, sort (release_date or avg rating from Review)
    try {
        const books = await Book.findAll({ where, include: [Publisher, Author, Genre] });
        res.json(books);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const getNewReleases = async (req, res) => {
    try {
        const books = await Book.findAll({
            order: [['release_date', 'DESC']],
            limit: 10,
            attributes: ['book_id', 'title', 'cover_image', 'release_date', 'price'],
            include: [
                {
                    model: Author,
                    attributes: ['author_id', 'name'],
                    through: { attributes: [] }
                }
            ]
        });

        const results = books.map(book => ({
            id: book.book_id,
            title: book.title,
            cover: book.cover_image,
            price: Number(book.price),
            authors: book.Authors.map(a => a.name).join(', ')
        }))
        res.json(results);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const getTopRatedBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            limit: 10,
            attributes: [
                'book_id',
                'title',
                'cover_image',
                'price',
                [sequelize.fn('AVG', sequelize.col('Reviews.rating')), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col('Reviews.review_id')), 'totalReviews'],
                [sequelize.fn('GROUP_CONCAT', sequelize.literal('DISTINCT `Authors`.`name`')), 'authorsNames'] // THÊM DISTINCT
            ],
            include: [
                {
                    model: Author,
                    attributes: [],
                    through: { attributes: [] }
                },
                {
                    model: Review,
                    attributes: [],
                    required: false
                }
            ],
            group: ['Book.book_id'],
            having: sequelize.where(
                sequelize.fn('COUNT', sequelize.col('Reviews.review_id')),
                '>=',
                1
            ),
            order: [[sequelize.fn('AVG', sequelize.col('Reviews.rating')), 'DESC']],
            subQuery: false,
            raw: true
        });

        const result = books.map(book => ({
            id: book.book_id,
            title: book.title,
            cover: book.cover_image,
            price: Number(book.price),
            avgRating: Number(book.avgRating || 0).toFixed(1),
            totalReviews: Number(book.totalReviews || 0),
            authors: book.authorsNames ? book.authorsNames.split(',').map(name => name.trim()).join(', ') : '' // Chuỗi, không mản
        }));

        res.json(result);
    } catch (err) {
        console.error('Lỗi lấy top sách:', err);
        res.status(500).json({ msg: 'Lỗi server' });
    }
};

const getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        // BƯỚC 1: Lấy sách
        const book = await Book.findByPk(id, {
            attributes: { exclude: ['createdAt', 'updatedAt', 'publisher_id'] },
            include: [
                { model: Author, attributes: ['name'], through: { attributes: [] } },
                { model: Genre, attributes: ['genre_id', 'name'], through: { attributes: [] } },
                { model: Publisher, attributes: ['name'] },
                {
                    model: Review,
                    attributes: ['review_id', 'rating', 'comment', 'review_date'],
                    include: [
                        { model: User, attributes: ['user_id', 'name', 'avatar'] }
                    ]
                }
            ]
        });

        if (!book) return res.status(404).json({ msg: 'Book not found' });

        // BƯỚC 2: Tính avg_rating
        const avgResult = await Review.findOne({
            where: { book_id: id },
            attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']],
            raw: true
        });

        const avgRating = avgResult?.avg_rating
            ? parseFloat(avgResult.avg_rating) // ← ÉP KIỂU CHÍNH XÁC
            : 0;

        const result = {
            id: book.book_id,
            title: book.title,
            description: book.description,
            price: Number(book.price),
            stock: book.stock,
            cover: book.cover_image,
            releaseDate: book.release_date,
            isbn: book.isbn,
            publisher: book.Publisher?.name,
            authors: book.Authors?.map(a => a.name).join(', '),
            genres: book.Genres,
            avg_rating: Number(avgRating.toFixed(1)), // ← ĐẢM BẢO LÀ NUMBER
            reviews: book.Reviews?.map(r => ({
                id: r.review_id,
                rating: r.rating,
                comment: r.comment,
                date: r.review_date,
                user: {
                    id: r.User?.user_id,
                    name: r.User?.name,
                    avatar: r.User?.avatar
                }
            })) || []
        };

        res.json(result);
    } catch (err) {
        console.error('Lỗi lấy sách:', err);
        res.status(500).json({ msg: 'Lỗi server' });
    }
};


// Update, delete tương tự...
// Ví dụ: exports.updateBook = ... ; exports.deleteBook = ...

export default { uploadCover, addBook, getBooks, getNewReleases, getTopRatedBooks, getBookById };