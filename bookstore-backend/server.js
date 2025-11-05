import './models/associations.js';
import express from 'express';
import sequelize from './config/db.js';
import 'dotenv/config';


// Routes
import userRoutes from './routes/users.js';
import bookRoutes from './routes/books.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import promoRoutes from './routes/promos.js';

const app = express();

app.use(express.json());

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/promos', promoRoutes);

// Sync DB and start server
async function start() {
    try {
        await sequelize.sync({ alter: true });
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error('Error: ' + err);
    }
}

start();