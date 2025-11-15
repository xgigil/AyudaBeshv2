import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  const db = client.db("ayudabesh");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
