import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    try {
      // Test if connection is still alive
      await cachedDb.admin().ping();
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      // Connection is dead, reset cache
      cachedClient = null;
      cachedDb = null;
    }
  }

  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, // 30 second timeout (increased for Atlas)
    connectTimeoutMS: 30000, // 30 second timeout
    socketTimeoutMS: 45000, // 45 second socket timeout
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 1, // Maintain at least 1 socket connection
    retryWrites: true,
    retryReads: true,
  });

  try {
    await client.connect();
    const db = client.db("ayudabesh");
    
    // Test the connection
    await db.admin().ping();

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error: any) {
    console.error("MongoDB connection error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Provide more helpful error messages
    if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
      throw new Error(
        `Database connection timed out. Please check:\n` +
        `1. Your internet connection\n` +
        `2. MongoDB Atlas IP whitelist (add your current IP: https://cloud.mongodb.com)\n` +
        `3. Firewall settings\n` +
        `Original error: ${errorMessage}`
      );
    }
    
    if (errorMessage.includes('authentication')) {
      throw new Error(`Database authentication failed. Please check your MongoDB credentials.`);
    }
    
    throw new Error(`Failed to connect to database: ${errorMessage}`);
  }
}
