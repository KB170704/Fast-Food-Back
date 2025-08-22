// models/Charge.js
const mongoose = require("mongoose");

const chargeSchema = new mongoose.Schema({
    name: { type: String, required: true },      // e.g., "Delivery Charge"
    amount: { type: Number, required: true },    // e.g., 25
    freeAbove: { type: Number, default: null },  // e.g., 250 (free above this amount)
    active: { type: Boolean, default: true }     // enable/disable
}, { timestamps: true });

module.exports = mongoose.model("Charge", chargeSchema);
