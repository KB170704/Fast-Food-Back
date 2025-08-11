const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    photo: { type: String },
    discount: { type: Number, default: 0 } // % off
});

module.exports = mongoose.model('Menu', menuSchema);
