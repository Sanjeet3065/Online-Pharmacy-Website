const express = require('express');
const router = express.Router();
const db = require('../data/db');

// ============================================
// GET all orders
// ============================================
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: db.orders.length,
      data: db.orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ============================================
// GET single order by ID
// ============================================
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const order = db.orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ============================================
// POST create new order (with stock deduction)
// ============================================
router.post('/', (req, res) => {
  try {
    const { customerName, medicineIds } = req.body;

    // Validation
    if (!customerName || !medicineIds || medicineIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer name and medicine IDs are required"
      });
    }

    let orderedMedicines = [];
    let totalAmount = 0;

    // Process each medicine
    for (let id of medicineIds) {
      const medicine = db.medicines.find(m => m.id === id);

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: `Medicine with ID ${id} not found`
        });
      }

      if (medicine.stock < 1) {
        return res.status(400).json({
          success: false,
          message: `${medicine.name} is out of stock`
        });
      }

      // Deduct stock
      medicine.stock -= 1;
      totalAmount += medicine.price;
      orderedMedicines.push({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price
      });
    }

    // Create order
    const newOrder = {
      id: db.orderIdCounter++,
      customerName: customerName.trim(),
      medicines: orderedMedicines,
      totalAmount: totalAmount,
      orderDate: new Date().toISOString(),
      status: "Pending"
    };

    db.orders.push(newOrder);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ============================================
// PUT update order status
// ============================================
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const order = db.orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use: Pending, Shipped, Delivered, Cancelled"
      });
    }

    order.status = status;

    res.json({
      success: true,
      message: "Order status updated",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ============================================
// DELETE order by ID
// ============================================
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = db.orders.findIndex(o => o.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const deleted = db.orders.splice(index, 1);

    res.json({
      success: true,
      message: "Order cancelled successfully",
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