const express = require('express');
const router = express.Router();
const db = require('../data/db');

// ============================================
// GET all medicines (with optional search)
// ============================================
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    let result = db.medicines;

    // Filter by category
    if (category) {
      result = result.filter(m => 
        m.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by name or category
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(query) || 
        m.category.toLowerCase().includes(query)
      );
    }

    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

// ============================================
// GET single medicine by ID
// ============================================
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const medicine = db.medicines.find(m => m.id === id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.json({
      success: true,
      data: medicine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ============================================
// POST create new medicine
// ============================================
router.post('/', (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required"
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0"
      });
    }

    const newMedicine = {
      id: db.medicineIdCounter++,
      name: name.trim(),
      category: category || "General",
      price: Number(price),
      stock: Number(stock) || 0
    };

    db.medicines.push(newMedicine);

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: newMedicine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ============================================
// PUT update medicine by ID
// ============================================
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const medicine = db.medicines.find(m => m.id === id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    const { name, category, price, stock } = req.body;

    if (name) medicine.name = name.trim();
    if (category) medicine.category = category;
    if (price !== undefined) {
      if (price <= 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be greater than 0"
        });
      }
      medicine.price = Number(price);
    }
    if (stock !== undefined) {
      if (stock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock cannot be negative"
        });
      }
      medicine.stock = Number(stock);
    }

    res.json({
      success: true,
      message: "Medicine updated successfully",
      data: medicine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ============================================
// DELETE medicine by ID
// ============================================
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = db.medicines.findIndex(m => m.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    const deleted = db.medicines.splice(index, 1);

    res.json({
      success: true,
      message: "Medicine deleted successfully",
      data: deleted[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;