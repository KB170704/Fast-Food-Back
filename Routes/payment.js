const express = require('express');
const router = express.Router();
const Order = require('../Models/order');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// EJS: List all orders
router.get('/all', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.render('payment-list', { orders });
});

// ✅ This should be inside Routes/payment.js
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Payment save error:", err);
    res.status(500).json({ error: 'Payment failed' });
  }
});

// GET single order by ID
// GET: Fetch a single order by ID (for invoice)
router.get('/order/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    console.error("Failed to fetch order:", err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});


// API: Update status
router.post('/order/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await Order.findByIdAndUpdate(id, { status });
    res.redirect('/payment/all');
  } catch (err) {
    console.error("Status update failed:", err);
    res.status(500).send('Status update failed');
  }
});

router.post('/create', async (req, res) => {
  const { items, totalPrice } = req.body;

  try {
    const newOrder = new Order({ items, totalPrice });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed', orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Add this in orderRoutes.js or a new admin route file
router.post('/admin/send-message/:id', async (req, res) => {
  const { id } = req.params;
  const { deliveryMessage } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { deliveryMessage },
      { new: true }
    );

    // Emit to frontend via socket
    req.app.get('io').emit('deliveryMessage', {
      orderId: id,
      message: deliveryMessage
    });

    res.redirect('/admin/orders'); // Redirect back to admin view
  } catch (err) {
    res.status(500).send('Error updating message');
  }
});


module.exports = router;
