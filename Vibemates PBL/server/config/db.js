const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vibemates';

  try {
    // Attempt MongoDB connection with 2.5s timeout for fast fallback if local mongo is absent
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.log(`\x1b[33m⚠ Note: Local MongoDB service is not currently active.\x1b[0m`);
    console.log(`\x1b[36m✔ VibeMates Smart Fallback Engine activated: Running seamlessly with full In-Memory & Demo Data support.\x1b[0m`);
    console.log(`\x1b[35mℹ To connect real MongoDB: update MONGODB_URI in server/.env with your local or Atlas URI.\x1b[0m`);
    return false;
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = {
  connectDB,
  getMongoStatus
};
