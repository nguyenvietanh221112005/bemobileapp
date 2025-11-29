const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const cartRoutes=require('./routes/cartRoutes');
const orderRoutes=require('./routes/orderRoutes');
const adminRoutes=require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/user', userRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/favorite', favoriteRoutes);

app.use('/api/category',categoryRoutes);
app.use('/api/cart',cartRoutes)
app.use('/api/order',orderRoutes)
app.use('/api/admin',adminRoutes)

// Server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});