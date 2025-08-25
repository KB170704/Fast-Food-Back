const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    category: { type: String, required: true },
    type: { type: String, required: true },
    fssaiLicense: { type: String, required: true },
    shelfLife: { type: String },
    returnPolicy: { type: String },
    storageTips: { type: String },
    unitNumber: { type: Number, default: 1 },
    unit: { type: String },
    keyFeatures: { type: String },
    manufacturerName: { type: String },
    manufacturerAddress: { type: String },
    customerCareDetails: { type: String },
    primaryPhoto: { type: String },
    photos: [{ type: String }],  // other photos except primary
    deliveryTime: { type: Number },
    customDetails: { type: Object, default: {} },
}, { timestamps: true });

// Virtual for final price after discount
menuSchema.virtual('finalPrice').get(function () {
    if (!this.discount) return this.price;
    return this.price - (this.price * this.discount) / 100;
});

menuSchema.set('toObject', { virtuals: true });
menuSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Menu', menuSchema);
