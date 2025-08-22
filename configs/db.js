const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_CONNECT);
    console.log(`🚀 MongoDB Connected`);
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1); // Exit on failure
  }
};

module.exports = dbConnection;