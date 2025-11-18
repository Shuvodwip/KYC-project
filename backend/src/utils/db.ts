import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'kyc_database';

let isUsingFallback = false;

if (!MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI not set - will use fallback mode');
  isUsingFallback = true;
}

/**
 * Connect to MongoDB Atlas with retry logic
 */
export async function connectDB(): Promise<void> {
  if (!MONGODB_URI) {
    console.log('💾 Using JSON file fallback mode (no MongoDB)');
    isUsingFallback = true;
    return;
  }

  let retries = 3;
  let lastError: any;

  while (retries > 0) {
    try {
      console.log(`🔄 Connecting to MongoDB Atlas... (attempt ${4 - retries}/3)`);
      
      const connectionOptions: any = {
        dbName: MONGODB_DB_NAME,
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 30000,
        connectTimeoutMS: 10000,
        retryWrites: false,
        w: 1,
        tls: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
      };
      
      await mongoose.connect(MONGODB_URI, connectionOptions);

      console.log('✅ MongoDB Atlas connected successfully');
      console.log(`📊 Database: ${MONGODB_DB_NAME}`);
      return;
    } catch (error) {
      lastError = error;
      retries--;
      
      if (retries > 0) {
        console.warn(`⚠️  Connection attempt failed. Retrying in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  console.error('❌ MongoDB connection failed after 3 attempts');
  console.log('💾 Falling back to JSON file storage mode');
  console.error('Error details:', lastError);
  isUsingFallback = true;
}

/**
 * Check if using fallback mode
 */
export function isUsingFallbackMode(): boolean {
  return isUsingFallback;
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
