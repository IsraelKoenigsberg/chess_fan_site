// Database connection file
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://yisraelkoenigsberg:VkhPXBb1J7XAVWv6@cluster0.wbu0e35.mongodb.net/UserInformation?retryWrites=true&w=majority";
const DB_NAME = process.env.DB_NAME || "UserInformation";

console.log('MongoDB Connection String:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Log with password masked
console.log('Database Name:', DB_NAME);

let dbConnection = null;

async function connectDB() {
    if (dbConnection) return dbConnection;

    try {
        console.log('Attempting to connect to MongoDB...');
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

// mongodb+srv://yisraelkoenigsberg:VkhPXBb1J7XAVWv6@cluster0.wbu0e35.mongodb.net/UserInformation?retryWrites=true&w=majority