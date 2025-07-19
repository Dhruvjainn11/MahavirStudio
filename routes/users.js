const express = require('express');
const User = require('../models/User');
const { authenticateUser, authorizeAdmin, authorizeUserOrAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
});

// Get single user by ID
router.get('/:id', authenticateUser, authorizeUserOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('wishlist', 'name price images');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error while fetching user' });
  }
});

// Update user profile
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error while updating user' });
  }
});

// Deactivate user (Admin only)
router.delete('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ error: 'Server error while deactivating user' });
  }
});

// Add address
router.post('/:id/addresses', authenticateUser,  async (req, res) => {
  try {
    const { type, address, city, state, pincode, isDefault , phone , fullName} = req.body;
    console.log(req.body);
    

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If this is the default address, set all others to false
    if (isDefault) {
      user.addresses.forEach(address => {
        address.isDefault = false;
      });
    }

    user.addresses.push({
      type,
      address,
      city,
      state,
      pincode,
      phone,
      fullName,
      isDefault
    });

    await user.save();

    res.status(201).json({
      message: 'Address added successfully',
      user: await User.findById(req.params.id).select('-password')
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ error: 'Server error while adding address' });
  }
});

// Update address
router.put('/:userId/addresses/:addressId', authenticateUser, async (req, res) => {
  try {
    const { type, address, city, state, pincode, isDefault, fullname, phone } = req.body; // Added phone, changed street to address

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const addressToUpdate = user.addresses.id(req.params.addressId);
    if (!addressToUpdate) return res.status(404).json({ error: 'Address not found' });

    // If setting as default, unset others
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Update fields
    addressToUpdate.type = type || addressToUpdate.type;
    addressToUpdate.address = address || addressToUpdate.address; // Changed from street to address
    addressToUpdate.city = city || addressToUpdate.city;
    addressToUpdate.state = state || addressToUpdate.state;
    addressToUpdate.pincode = pincode || addressToUpdate.pincode;
    addressToUpdate.isDefault = isDefault ?? addressToUpdate.isDefault;
    addressToUpdate.fullname = fullname || addressToUpdate.fullname;
    addressToUpdate.phone = phone || addressToUpdate.phone;

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      user: await User.findById(req.params.userId).select('-password')
    });
    
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Server error while updating address' 
    });
  }
});

// Delete address
router.delete('/:userId/addresses/:addressId', authenticateUser, async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    // Find user and update in single operation
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if address was actually removed
    const addressExists = updatedUser.addresses.some(addr => addr._id.toString() === addressId);
    if (addressExists) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({
      success: true,
      message: 'Address deleted successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Server error while deleting address' 
    });
  }
});

// Set default address
router.patch('/:userId/addresses/:addressId/default', authenticateUser, async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    // 1. Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 2. Verify the address exists in user's addresses
    const addressExists = user.addresses.some(addr => addr._id.toString() === addressId);
    if (!addressExists) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // 3. Reset all addresses' isDefault to false
    user.addresses.forEach(address => {
      address.isDefault = false;
    });

    // 4. Set the specified address as default
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    user.addresses[addressIndex].isDefault = true;

    // 5. Save the updated user
    await user.save();

    // 6. Return the updated user
    res.json({ 
      success: true, 
      user: {
        _id: user._id,
        addresses: user.addresses
      }
    });

  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ error: 'Server error while setting default address' });
  }
});

// Change password
router.put('/:id/password', authenticateUser,  async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error while changing password' });
  }
});

// Promote user to admin (Admin only)
router.patch('/:id/promote', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User promoted to admin successfully',
      user
    });
  } catch (error) {
    console.error('Promote user error:', error);
    res.status(500).json({ error: 'Server error while promoting user' });
  }
});

module.exports = router;
