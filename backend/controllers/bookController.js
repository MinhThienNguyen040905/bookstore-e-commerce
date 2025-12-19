// controllers/bookController.js
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
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });
const uploadCover = upload.single('cover_image');

// === ADD BOOK ===
const addBook = async (req, res) => {
    const { title, description, publisher_id, stock, price, release_date, isbn, authors, genres } = req.body;
    try {
        let cover_image = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            cover_image = result.secure_url;
            fs.unlinkSync(req.file.path); // Xóa file tạm
        }

        const book = await Book.create({
            title, description, publisher_id, stock, price,
            cover_image, release_date, isbn
        });

        if (authors) {
            const authorInstances = await Author.findAll({ where: { author_id: authors.split(',') } });
            await book.addAuthors(authorInstances);
        }
        if (genres) {
            const genreInstances = await Genre.findAll({ where: { genre_id: genres.split(',') } });
            await book.addGenres(genreInstances);
        }

        res.success({ book_id: book.book_id }, 'Thêm sách thành công', 201);
    } catch (err) {
        res.error(err.message || 'Lỗi thêm sách', 400);
    }
};

// === GET ALL BOOKS ===
const getBooks = async (req, res) => {
    const { title, author, genre, min_price, max_price, sort } = req.query;
    let where = {};

    if (title) where.title = { [Op.like]: `%${title}%` };
    if (min_price) where.price = { ...where.price, [Op.gte]: min_price };
    if (max_price) where.price = { ...where.price, [Op.lte]: max_price };

    try {
        const books = await Book.findAll({
            where,
            attributes: ['book_id', 'title', 'cover_image', 'price', 'stock'],
            include: [
                { model: Publisher, attributes: ['name'] },
                { model: Author, attributes: ['name'], through: { attributes: [] } },
                { model: Genre, attributes: ['name'], through: { attributes: [] } }
            ],
            order: sort === 'price' ? [['price', 'ASC']] : [['book_id', 'DESC']]
        });

        const result = books.map(book => ({
            book_id: book.book_id,
            title: book.title,
            cover_image: book.cover_image,
            price: Number(book.price),
            stock: book.stock,
            publisher: book.Publisher?.name,
            authors: book.Authors?.map(a => a.name).join(', '),
            genres: book.Genres?.map(g => g.name).join(', ')
        }));

        res.success(result, 'Lấy danh sách sách thành công');
    } catch (err) {
        res.error('Lỗi server', 500);
    }
};

// === GET NEW RELEASES ===
const getNewReleases = async (req, res) => {
    try {
        const books = await Book.findAll({
            order: [['release_date', 'DESC']],
            limit: 10,
            attributes: ['book_id', 'title', 'cover_image', 'release_date', 'price'],
            include: [
                { model: Author, attributes: ['name'], through: { attributes: [] } }
            ]
        });

        const result = books.map(book => ({
            book_id: book.book_id,
            title: book.title,
            cover_image: book.cover_image,
            price: Number(book.price),
            release_date: book.release_date,
            authors: book.Authors.map(a => a.name).join(', ')
        }));

        res.success(result, 'Lấy sách mới nhất thành công');
    } catch (err) {
        res.error('Lỗi server', 500);
    }
};

// === GET TOP RATED BOOKS ===
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
                [sequelize.fn('GROUP_CONCAT', sequelize.literal('DISTINCT `Authors`.`name`')), 'authorsNames']
            ],
            include: [
                { model: Author, attributes: [], through: { attributes: [] } },
                { model: Review, attributes: [], required: false }
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
            book_id: book.book_id,
            title: book.title,
            cover_image: book.cover_image,
            price: Number(book.price),
            avgRating: Number(book.avgRating || 0).toFixed(1),
            totalReviews: Number(book.totalReviews || 0),
            authors: book.authorsNames ? book.authorsNames.split(',').map(n => n.trim()).join(', ') : ''
        }));

        res.success(result, 'Lấy top sách thành công');
    } catch (err) {
        res.error('Lỗi server', 500);
    }
};

// === GET BOOK BY ID ===
const getBookById = async (req, res) => {
    const { id } = req.params;
    try {
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

        if (!book) return res.error('Sách không tồn tại', 404);

        const avgResult = await Review.findOne({
            where: { book_id: id },
            attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']],
            raw: true
        });

        const avgRating = avgResult?.avg_rating
            ? parseFloat(avgResult.avg_rating) // ← ÉP KIỂU CHÍNH XÁC
            : 0;

        const result = {
            book_id: book.book_id,
            title: book.title,
            description: book.description,
            price: Number(book.price),
            stock: book.stock,
            cover_image: book.cover_image,
            release_date: book.release_date,
            isbn: book.isbn,
            publisher: book.Publisher?.name,
            authors: book.Authors?.map(a => a.name).join(', '),
            genres: book.Genres,
            avg_rating: Number(avgRating.toFixed(1)),
            reviews: book.Reviews?.map(r => ({
                review_id: r.review_id,
                rating: r.rating,
                comment: r.comment,
                review_date: r.review_date,
                user: {
                    user_id: r.User?.user_id,
                    name: r.User?.name,
                    avatar: r.User?.avatar
                }
            })) || []
        };

        res.success(result, 'Lấy thông tin sách thành công');
    } catch (err) {
        res.error('Lỗi server', 500);
    }
};

// === UPDATE BOOK ===
const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, description, publisher_id, stock, price, release_date, isbn, authors, genres } = req.body;

    try {
        // Validation: ID phải là số
        if (isNaN(id)) {
            return res.error('ID sách không hợp lệ', 400);
        }

        const book = await Book.findByPk(id);
        if (!book) {
            return res.error('Không tìm thấy sách', 404);
        }

        // Validation: Price phải là số dương
        if (price !== undefined && (isNaN(price) || price < 0)) {
            return res.error('Giá sách phải là số dương', 400);
        }

        // Validation: Stock phải là số nguyên không âm
        if (stock !== undefined && (isNaN(stock) || stock < 0 || !Number.isInteger(Number(stock)))) {
            return res.error('Số lượng tồn kho phải là số nguyên không âm', 400);
        }

        // Validation: Publisher ID phải là số
        if (publisher_id !== undefined && isNaN(publisher_id)) {
            return res.error('ID nhà xuất bản không hợp lệ', 400);
        }

        // Nếu có upload ảnh mới
        let cover_image = book.cover_image; // Giữ ảnh cũ mặc định
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            cover_image = result.secure_url;
            fs.unlinkSync(req.file.path); // Xóa file tạm

            // (Bonus) Xóa ảnh cũ trên Cloudinary
            if (book.cover_image) {
                try {
                    const urlParts = book.cover_image.split('/');
                    const publicIdWithExt = urlParts[urlParts.length - 1];
                    const publicId = publicIdWithExt.split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.log('Không xóa được ảnh cũ:', err.message);
                }
            }
        }

        // Update các field (chỉ update những field được truyền vào)
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (publisher_id !== undefined) updateData.publisher_id = publisher_id;
        if (stock !== undefined) updateData.stock = stock;
        if (price !== undefined) updateData.price = price;
        if (release_date !== undefined) updateData.release_date = release_date;
        if (isbn !== undefined) updateData.isbn = isbn;
        if (cover_image) updateData.cover_image = cover_image;

        await book.update(updateData);

        // Update authors nếu có
        if (authors) {
            const authorInstances = await Author.findAll({ 
                where: { author_id: authors.split(',').map(id => id.trim()) } 
            });
            await book.setAuthors(authorInstances); // setAuthors thay vì addAuthors
        }

        // Update genres nếu có
        if (genres) {
            const genreInstances = await Genre.findAll({ 
                where: { genre_id: genres.split(',').map(id => id.trim()) } 
            });
            await book.setGenres(genreInstances);
        }

        res.success({ book_id: book.book_id }, 'Cập nhật sách thành công');

    } catch (err) {
        console.error('Update book error:', err);
        res.error(err.message || 'Lỗi cập nhật sách', 400);
    }
};

// === DELETE BOOK ===
const deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        // Validation: ID phải là số
        if (isNaN(id)) {
            return res.error('ID sách không hợp lệ', 400);
        }

        const book = await Book.findByPk(id);
        if (!book) {
            return res.error('Không tìm thấy sách', 404);
        }

        // (Bonus) Xóa ảnh trên Cloudinary
        if (book.cover_image) {
            try {
                const urlParts = book.cover_image.split('/');
                const publicIdWithExt = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExt.split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.log('Không xóa được ảnh:', err.message);
            }
        }

        // Xóa record (cascade sẽ tự xóa reviews, cart items, etc.)
        await book.destroy();

        res.success(null, 'Xóa sách thành công');

    } catch (err) {
        console.error('Delete book error:', err);
        res.error('Lỗi xóa sách', 500);
    }
};

export default { uploadCover, addBook, updateBook, deleteBook, getBooks, getNewReleases, getTopRatedBooks, getBookById };