const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
