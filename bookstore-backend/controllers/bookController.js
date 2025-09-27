const Book = require('../models/Book');
const Author = require('../models/Author');
const Genre = require('../models/Genre');
const Publisher = require('../models/Publisher');
const cloudinary = require('../cloudinary');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });  // Tạm lưu local trước khi upload Cloudinary

// Middleware upload ảnh
exports.uploadCover = upload.single('cover_image');

// Add book (with authors, genres)
exports.addBook = async (req, res) => {
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
exports.getBooks = async (req, res) => {
    const { title, author, genre, min_price, max_price, sort } = req.query;
    let where = {};
    if (title) where.title = { [Op.like]: `%${title}%` };
    // Thêm logic cho author, genre (JOIN), price, sort (release_date or avg rating from Review)
    try {
        const books = await Book.findAll({ where, include: [Publisher, Author, Genre] });  // Include associations
        res.json(books);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Update, delete tương tự...
// Ví dụ: exports.updateBook = ... ; exports.deleteBook = ...