const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: 'admin@mahavirstudio.com',
      isAdmin: true 
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Admin ID:', existingAdmin._id);
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: 'Administrator',
      email: 'admin@mahavirstudio.com',
      password: 'admin123', // Will be hashed automatically by the pre-save hook
      isAdmin: true,
      isActive: true,
      emailVerified: true
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@mahavirstudio.com');
    console.log('🔑 Password: admin123');
    console.log('🆔 Admin ID:', adminUser._id);
    console.log('');
    console.log('⚠️  Please change the password after first login!');
    console.log('');
    console.log('🚀 You can now login to the admin panel at:');
    console.log('POST /api/admin/auth/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdmin();
