import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB(){
    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
}

export default connectDB