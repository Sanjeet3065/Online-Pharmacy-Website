// ============================================
// DEPENDENCIES
// ============================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const medicineRoutes = require('./routes/medicines');
const orderRoutes = require('./routes/orders');

// ============================================
// INITIALIZE APP
// ============================================
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (simple)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ============================================
// ROUTES
// ============================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Pharmacy API is running",
    endpoints: {
      medicines: "/api/medicines",
      orders: "/api/orders"
    }
  });
});

app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server"
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Medicines: ${require('./data/db').medicines.length}`);
  console.log(`📦 Orders: ${require('./data/db').orders.length}`);
});