// Database connection
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "UserInformation";

let dbConnection = null;

async function connectDB() {
    if (dbConnection) return dbConnection;

    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log("Connected to MongoDB successfully");

        dbConnection = client.db(DB_NAME);
        return dbConnection;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}

export default connectDB;

