const express = require('express');
const router = express.Router();
const { Cart, Medicine } = require('../data/db');

// ✅ GET - Cart Dekhna
router.get('/', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: 'default' });
        if (!cart) {
            return res.json({ success: true, data: [], totalAmount: 0 });
        }
        res.json({ 
            success: true, 
            data: cart.items, 
            totalAmount: cart.totalAmount 
        });
    } catch (error) {
        console.error("GET /cart Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ POST - Cart Mein Item Add Karna (FIXED)
router.post('/add', async (req, res) => {
    try {
        const { medicineId, quantity = 1 } = req.body;

        console.log("Received medicineId:", medicineId); // Debug

        // 🔥 Medicine find karo
        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            console.log("Medicine not found for ID:", medicineId);
            return res.status(404).json({ 
                success: false, 
                message: "Medicine not found" 
            });
        }

        console.log("Found medicine:", medicine.name); // Debug

        // 🔥 Stock check karo
        if (medicine.stock < quantity) {
            return res.status(400).json({ 
                success: false, 
                message: "Insufficient stock" 
            });
        }

        // 🔥 Cart find karo ya naya banao
        let cart = await Cart.findOne({ userId: 'default' });
        if (!cart) {
            cart = new Cart({ 
                userId: 'default', 
                items: [], 
                totalAmount: 0 
            });
        }

        // 🔥 Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.medicineId.toString() === medicineId
        );

        if (existingItemIndex !== -1) {
            // ✅ Agar already hai toh quantity badhao
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // ✅ Naya item add karo (SARA DATA BHAR KAR)
            cart.items.push({
                medicineId: medicine._id,
                name: medicine.name,           // ✅ Name
                category: medicine.category,   // ✅ Category
                price: medicine.price,         // ✅ Price
                quantity: quantity,
                stock: medicine.stock
            });
        }

        // 🔥 Total Amount Calculate Karo
        cart.totalAmount = cart.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // 🔥 Save Karo
        await cart.save();
        
        res.json({ 
            success: true, 
            message: "Item added to cart", 
            data: cart.items,
            totalAmount: cart.totalAmount
        });
    } catch (error) {
        console.error("POST /cart/add Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// ✅ PUT - Cart Item Update Karna
router.put('/update/:medicineId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ userId: 'default' });
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: "Cart not found" 
            });
        }

        const item = cart.items.find(
            item => item.medicineId.toString() === req.params.medicineId
        );
        if (!item) {
            return res.status(404).json({ 
                success: false, 
                message: "Item not found in cart" 
            });
        }

        // Stock check
        const medicine = await Medicine.findById(req.params.medicineId);
        if (medicine && medicine.stock < quantity) {
            return res.status(400).json({ 
                success: false, 
                message: "Insufficient stock" 
            });
        }

        item.quantity = quantity;
        
        // Recalculate total
        cart.totalAmount = cart.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        await cart.save();
        
        res.json({ 
            success: true, 
            message: "Cart updated", 
            data: cart.items,
            totalAmount: cart.totalAmount
        });
    } catch (error) {
        console.error("PUT /cart/update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ DELETE - Cart Se Item Remove Karna
router.delete('/remove/:medicineId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: 'default' });
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: "Cart not found" 
            });
        }

        cart.items = cart.items.filter(
            item => item.medicineId.toString() !== req.params.medicineId
        );
        
        // Recalculate total
        cart.totalAmount = cart.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        await cart.save();
        
        res.json({ 
            success: true, 
            message: "Item removed from cart", 
            data: cart.items,
            totalAmount: cart.totalAmount
        });
    } catch (error) {
        console.error("DELETE /cart/remove Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;





