const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: 'default',
        unique: true
    },
    items: [cartItemSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);