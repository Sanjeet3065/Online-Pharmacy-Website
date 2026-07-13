const mongoose = require('mongoose');

// ✅ MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        process.exit(1);
    }
};

// ✅ Medicine Schema
const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 }
}, { timestamps: true });

// ✅ CART SCHEMA (UPDATED - Full Details Store Karega)
// ✅ CART SCHEMA (NAYA - Simple, no required validations)
const cartItemSchema = new mongoose.Schema({
    medicineId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Medicine'
    },
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 },
    stock: { type: Number, default: 0 }
});

const cartSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        default: 'default', 
        unique: true 
    },
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

// ✅ ORDER SCHEMA (UPDATED - Full Details Store Karega)
const orderSchema = new mongoose.Schema({
    customerName: { 
        type: String, 
        required: true 
    },
    medicines: [{
        medicineId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Medicine' 
        },
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, default: 1, min: 1 }
    }],
    totalAmount: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    }
}, { timestamps: true });

// ✅ Models
const Medicine = mongoose.model('Medicine', medicineSchema);
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartSchema);

module.exports = { connectDB, Medicine, Order, Cart }; 