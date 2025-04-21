import dotenv from 'dotenv';
import mongoose from 'mongoose';
import colors from 'colors';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

dotenv.config();

const DB_URI = process.env.MONGODB_URI;

const connectDB = asyncHandler(async () =>{
    try {
        const connection = await mongoose.connect(DB_URI);
        console.log(`MongoDB connected: ${connection.connection.host}`.cyan.underline);
    } catch (error) {
        throw new ApiError(500, "Database connection failed", [], error.stack);
    }
})

export { connectDB };