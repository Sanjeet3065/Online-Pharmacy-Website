const express = require('express');
const router = express.Router();
const { Order, Cart, Medicine } = require('../data/db');

// ✅ GET - Saare Orders Dekhna
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error("GET /orders Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ GET - Ek Order Dekhna (String ID)
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        console.error("GET /orders/:id Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ POST - Order Create Karna (Bina customerName ke, items se)
router.post('/', async (req, res) => {
    try {
        const { items } = req.body;

        console.log("📦 Received items:", items);

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Items are required"
            });
        }

        let orderItems = [];
        let totalAmount = 0;

        for (let item of items) {
            const medicine = await Medicine.findById(item.medicineId);
            if (!medicine) {
                console.log("❌ Medicine not found for ID:", item.medicineId);
                return res.status(404).json({
                    success: false,
                    message: `Medicine with ID ${item.medicineId} not found`
                });
            }

            const quantity = parseInt(item.quantity) || 1;

            console.log(`✅ Found: ${medicine.name}, Qty: ${quantity}`);

            if (medicine.stock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${medicine.name} has only ${medicine.stock} stock`
                });
            }

            medicine.stock -= quantity;
            await medicine.save();

            orderItems.push({
                medicineId: medicine._id,
                name: medicine.name,
                category: medicine.category,
                price: medicine.price,
                quantity: quantity
            });
            totalAmount += medicine.price * quantity;
        }

        const order = new Order({
            customerName: "Customer",
            medicines: orderItems,
            totalAmount: totalAmount,
            status: 'Pending'
        });

        await order.save();

        // ✅ Cart empty karo
        await Cart.findOneAndDelete({ userId: 'default' });

        console.log("✅ Order placed:", order._id);

        res.status(201).json({
            success: true,
            message: "Order placed successfully! Cart cleared.",
            data: order
        });
    } catch (error) {
        console.error("POST /orders Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ PUT - Order Status Update Karna (String ID)
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Use: Pending, Shipped, Delivered, Cancelled"
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: "Order status updated",
            data: order
        });
    } catch (error) {
        console.error("PUT /orders/:id Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ DELETE - Order Cancel Karna (String ID)
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        res.json({
            success: true,
            message: "Order cancelled successfully"
        });
    } catch (error) {
        console.error("DELETE /orders/:id Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;