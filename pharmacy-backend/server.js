const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./data/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));

// ✅ Home Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Pharmacy API is running with MongoDB",
        endpoints: {
            medicines: "/api/medicines",
            orders: "/api/orders",
            cart: "/api/cart"
        }
    });
});

// ✅ 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).json({
        success: false,
        message: err.message || "Something went wrong on the server"
    });
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});