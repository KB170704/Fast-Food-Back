const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  address: String,
  paymentMethod: String,
  cardNumber: String,
  expiryDate: String,
  cvv: String,
  totalAmount: Number,
  status: {
    type: String,
    enum: ['Pending', 'Delivered'],
    default: 'Pending',
  },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  totalPrice: Number,
  status: { type: String, default: 'pending' },
  deliveryMessage: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema);