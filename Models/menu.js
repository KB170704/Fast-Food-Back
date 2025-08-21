const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // discount %
    category: { type: String, required: true },
    type: { type: String }, // veg/non-veg, etc.
    fssaiLicense: { type: String },
    shelfLife: { type: String },
    returnPolicy: { type: String },
    storageTips: { type: String },
    unitNumber: { type: Number, default: 1 }, // e.g., 1 kg, 500 ml
    unit: { type: String }, // e.g., kg, ml, piece
    keyFeatures: { type: String },
    manufacturerName: { type: String },
    manufacturerAddress: { type: String },
    customerCareDetails: { type: String },
    photos: [{ type: String }], // multiple photos
    deliveryTime: { type: Number }, // in minutes
}, { timestamps: true });

// Virtual for calculating price after discount
menuSchema.virtual('finalPrice').get(function () {
    if (!this.discount) return this.price;
    return this.price - (this.price * this.discount) / 100;
});

module.exports = mongoose.model('Menu', menuSchema);
