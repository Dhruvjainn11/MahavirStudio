const mongoose = require('mongoose');

const paintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  shadeCode: {
    type: String,
    required: true,
    unique: true
  },
  hexValue: {
    type: String,
    required: true,
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  },
  brand: {
    type: String,
    required: true
  },
  colorFamily: {
    type: String,
    required: true
  },
  finish: {
    type: String,
    required: true
  },
  image: {
    url: String,
    alt: String
  },
  availableSizes: [{
    size: String,
    price: Number
  }],
  description: {
    type: String
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
paintSchema.index({ name: 'text', shadeCode: 'text', brand: 'text' });
paintSchema.index({ categoryId: 1 });

module.exports = mongoose.model('Paint', paintSchema);

