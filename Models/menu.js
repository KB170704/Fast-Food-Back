const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    discount: { type: Number, default: 0 },
    description: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);