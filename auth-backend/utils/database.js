import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 1
    });
    
    console.log('MongoDB Connected:', conn.connection.host);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
};

export default connectDB;
