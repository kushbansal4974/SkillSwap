import mongoose from "mongoose";
import dns from "node:dns";

const connectDB = async () => {
    try {
        try {
            dns.setServers(["1.1.1.1", "8.8.8.8"]);
        } catch {
            // Ignore if custom DNS not permitted
        }

        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skillswap";
        
        // Explicitly set dbName to skillswap so Mongoose never writes to test
        const connection = await mongoose.connect(mongoUri, {
            dbName: "skillswap",
            serverSelectionTimeoutMS: 8000,
        });

        console.log(`✅ MongoDB connected successfully to database [${connection.connection.name}] at ${connection.connection.host}`);
        return connection;
    } catch (primaryError) {
        console.error(`⚠️ Primary MongoDB connection failed (${primaryError.message}). Attempting local fallback...`);
        try {
            const fallbackConnection = await mongoose.connect("mongodb://127.0.0.1:27017/skillswap", {
                dbName: "skillswap",
                serverSelectionTimeoutMS: 4000,
            });
            console.log(`✅ Local MongoDB connected successfully to database [${fallbackConnection.connection.name}]`);
            return fallbackConnection;
        } catch (fallbackError) {
            console.error(`❌ Both primary and local MongoDB connections failed: ${fallbackError.message}`);
        }
    }
};

export default connectDB;