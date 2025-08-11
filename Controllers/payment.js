const Payment = require('../Models/order');

exports.createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json({ message: 'Payment recorded successfully', payment });
  } catch (err) {
    console.error('Payment save error:', err);
    res.status(500).json({ error: 'Failed to save payment' });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};
