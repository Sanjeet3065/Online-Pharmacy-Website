const express = require('express');
const router = express.Router();
const { Medicine } = require('../data/db');

// ✅ CREATE - Medicine Add
router.post('/', async (req, res) => {
    try {
        const { name, category, price, stock } = req.body;
        
        if (!name || !category || price === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: "Name, category and price are required" 
            });
        }

        const medicine = new Medicine({ name, category, price, stock: stock || 0 });
        await medicine.save();
        
        res.status(201).json({
            success: true,
            message: "Medicine added successfully",
            data: medicine
        });
    } catch (error) {
        console.error("POST /api/medicines Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server error" 
        });
    }
});

// ✅ READ ALL - with Search & Category Filter (Case-Insensitive)
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let filter = {};

        console.log("🔍 Received search query:", search);

        // ✅ Category filter
        if (category) {
            filter.category = category;
        }

        // ✅ Search filter - Case-INSENSITIVE (name OR category dono mein)
        if (search && search.trim() !== '') {
            // ✅ $regex with 'i' option = case-insensitive
            const searchRegex = { $regex: search.trim(), $options: 'i' };
            filter.$or = [
                { name: searchRegex },
                { category: searchRegex }
            ];
        }

        const medicines = await Medicine.find(filter).sort({ createdAt: -1 });
        
        console.log("✅ Found:", medicines.length, "medicines");

        res.json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (error) {
        console.error("GET /api/medicines Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server error" 
        });
    }
});

// ✅ READ ONE - Get single medicine
router.get('/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ 
                success: false, 
                message: "Medicine not found" 
            });
        }
        res.json({ success: true, data: medicine });
    } catch (error) {
        console.error("GET /api/medicines/:id Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server error" 
        });
    }
});

// ✅ UPDATE - Update medicine
router.put('/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!medicine) {
            return res.status(404).json({ 
                success: false, 
                message: "Medicine not found" 
            });
        }
        res.json({
            success: true,
            message: "Medicine updated successfully",
            data: medicine
        });
    } catch (error) {
        console.error("PUT /api/medicines/:id Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server error" 
        });
    }
});

// ✅ DELETE - Delete medicine
router.delete('/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!medicine) {
            return res.status(404).json({ 
                success: false, 
                message: "Medicine not found" 
            });
        }
        res.json({
            success: true,
            message: "Medicine deleted successfully"
        });
    } catch (error) {
        console.error("DELETE /api/medicines/:id Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server error" 
        });
    }
});

// ✅ BULK CREATE - 20 medicines ek saath
router.post('/bulk', async (req, res) => {
    try {
        const medicines = await Medicine.insertMany(req.body);
        res.status(201).json({
            success: true,
            message: `${medicines.length} medicines added successfully`,
            data: medicines
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ✅ YEH LINE HONI CHAHIYE (SABSE IMPORTANT)
module.exports = router;  