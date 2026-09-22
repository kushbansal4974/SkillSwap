import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skillswap";
        const connection = await mongoose.connect(mongoUri);

        console.log(`✅ MongoDB connected successfully: ${connection.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        console.warn("⚠️  Make sure MongoDB is running locally or set MONGO_URI in backend/.env");
    }
};

export default connectDB;