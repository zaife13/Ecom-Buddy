const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  title: { type: String },
  image: { type: String },
  min_order: { type: String },
  price_range: { type: String },
  p_link: { type: String },
  name: { type: String },
  level: { type: Number },
  link: { type: String },
  country: { type: String },
  rating: { type: String },
  previous_orders: { type: String },
  experience: { type: String },
  isVerified: { type: Boolean },
});

module.exports = mongoose.model('Supplier', supplierSchema);
