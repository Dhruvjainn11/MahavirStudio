const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config(); // Ensure dotenv is loaded for standalone script execution

async function createAdmin() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      // Add recommended options for new Mongoose versions
      // useNewUrlParser: true, // Deprecated in newer Mongoose
      // useUnifiedTopology: true // Deprecated in newer Mongoose
    });
    console.log('✅ Connected to MongoDB');

    // 2. Check if admin already exists
    const adminEmail = 'admin@mahavirstudio.com';
    const existingAdmin = await User.findOne({
      email: adminEmail,
      isAdmin: true
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('🆔 Admin ID:', existingAdmin._id);
      return; // Use return instead of process.exit() here to allow finally block to execute
    }

    // 3. Define the default password (IMPROVEMENT: Use ENV variable)
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    if (defaultAdminPassword === 'admin123') {
        console.warn('🚨 WARNING: Using default hardcoded password "admin123". STRONGLY recommend setting DEFAULT_ADMIN_PASSWORD in your .env file!');
    }


    // 4. Create admin user
    const adminUser = new User({
      name: 'Administrator',
      email: adminEmail,
      password: defaultAdminPassword, // Use the (preferably ENV) password
      isAdmin: true,
      isActive: true,
      emailVerified: true // Good to have this true for an admin
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', defaultAdminPassword); // Display the actual password used
    console.log('🆔 Admin ID:', adminUser._id);
    console.log('\n');
    console.log('--- IMPORTANT ---');
    console.log('⚠️  If using a default password, please change it immediately after first login!');
    console.log('🚀 You can now login to the admin panel at:');
    console.log('   POST /api/admin/auth/login');
    console.log('-----------------\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.error('Error details:', error.message); // Log error message for clarity
    // Consider adding specific error handling for duplicate key if email is also unique for all users
    // if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
    //   console.error('An account with this email already exists.');
    // }
    process.exitCode = 1; // Set exit code for non-graceful exit
  } finally {
    // 5. Ensure Mongoose disconnects gracefully
    if (mongoose.connection.readyState === 1) { // Check if connected before trying to disconnect
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
    process.exit(); // Exit process after connection is closed or error handled
  }
}

// Run the script
createAdmin();