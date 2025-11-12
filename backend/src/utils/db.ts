import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'kyc_database';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

/**
 * Connect to MongoDB Atlas
 */
export async function connectDB(): Promise<void> {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
    });

    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`📊 Database: ${MONGODB_DB_NAME}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnection failed:', error);
    throw error;
  }
}

/**
 * Get database connection status
 */
export function isDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
