// models/Wishlist.js
const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to your Product model
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to your User model
    required: true,
    unique: true, // A user can only have one wishlist
  },
  items: [WishlistItemSchema],
}, { timestamps: true });

// Export the model using module.exports for CommonJS
// This checks if the model already exists to prevent OverwriteModelError in watch mode
module.exports = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);