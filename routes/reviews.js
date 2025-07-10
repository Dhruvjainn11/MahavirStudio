const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');

const router = express.Router();

// Get all reviews (Admin only)
router.get('/', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, productId, userId, rating } = req.query;

    const filter = {};
    if (productId) filter.productId = productId;
    if (userId) filter.userId = userId;
    if (rating) filter.rating = parseInt(rating);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filter)
      .populate('userId', 'name email')
      .populate('productId', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error while fetching reviews' });
  }
});

// Get reviews for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;

    const filter = { 
      productId: req.params.productId,
      isApproved: true
    };
    
    if (rating) filter.rating = parseInt(rating);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filter)
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { productId: req.params.productId, isApproved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      ratingStats
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({ error: 'Server error while fetching product reviews' });
  }
});

// Get single review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('productId', 'name images');

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ error: 'Server error while fetching review' });
  }
});

// Create new review
router.post('/', authenticateUser, validateReview, async (req, res) => {
  try {
    const { productId, rating, comment, images } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      userId: req.user._id,
      productId
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Create review
    const review = new Review({
      userId: req.user._id,
      productId,
      rating,
      comment,
      images: images || []
    });

    await review.save();

    // Update product rating
    await updateProductRating(productId);

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name')
      .populate('productId', 'name images');

    res.status(201).json({
      message: 'Review created successfully',
      review: populatedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Server error while creating review' });
  }
});

// Update review
router.put('/:id', authenticateUser, validateReview, async (req, res) => {
  try {
    const { rating, comment, images } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user owns this review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    review.rating = rating;
    review.comment = comment;
    review.images = images || review.images;

    await review.save();

    // Update product rating
    await updateProductRating(review.productId);

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name')
      .populate('productId', 'name images');

    res.json({
      message: 'Review updated successfully',
      review: populatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Server error while updating review' });
  }
});

// Delete review
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user owns this review or is admin
    if (review.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    await updateProductRating(productId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Server error while deleting review' });
  }
});

// Toggle review approval (Admin only)
router.patch('/:id/approve', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('userId', 'name')
     .populate('productId', 'name images');

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Update product rating
    await updateProductRating(review.productId);

    res.json({
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      review
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ error: 'Server error while approving review' });
  }
});

// Mark review as verified (Admin only)
router.patch('/:id/verify', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).populate('userId', 'name')
     .populate('productId', 'name images');

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      message: 'Review verified successfully',
      review
    });
  } catch (error) {
    console.error('Verify review error:', error);
    res.status(500).json({ error: 'Server error while verifying review' });
  }
});

// Update helpful votes
router.patch('/:id/helpful', authenticateUser, async (req, res) => {
  try {
    const { increment } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulVotes: increment ? 1 : -1 } },
      { new: true }
    ).populate('userId', 'name')
     .populate('productId', 'name images');

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      message: 'Helpful votes updated successfully',
      review
    });
  } catch (error) {
    console.error('Update helpful votes error:', error);
    res.status(500).json({ error: 'Server error while updating helpful votes' });
  }
});

// Helper function to update product rating
async function updateProductRating(productId) {
  try {
    const reviews = await Review.find({ productId, isApproved: true });
    
    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        'rating.average': 0,
        'rating.count': 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      'rating.average': parseFloat(averageRating.toFixed(1)),
      'rating.count': reviews.length
    });
  } catch (error) {
    console.error('Update product rating error:', error);
  }
}

module.exports = router;
