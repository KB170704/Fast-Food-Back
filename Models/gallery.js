const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String, // Store just the filename like "pizza.jpg"
});

module.exports = mongoose.model('Gallery', gallerySchema);