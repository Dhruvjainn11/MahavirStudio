const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
