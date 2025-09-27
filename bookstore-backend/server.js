const express = require('express');
const sequelize = require('./config/db');
const app = express();
require('dotenv').config();

// Routes
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const promoRoutes = require('./routes/promos');

app.use(express.json());

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/promos', promoRoutes);

// Sync DB and start server
sequelize.sync({ alter: true }).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch(err => console.log('Error: ' + err));