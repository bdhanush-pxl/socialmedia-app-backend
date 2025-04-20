require('dotenv').config();
const mongoose = require('mongoose');
const DB_URI = process.env.MONGODB_URI;
const {asyncHandler} = require('./utils/asyncHandler.js');
const {ApiError} = require('./utils/ApiError.js');

const connectDB = asyncHandler(async () =>{
    try {
        const connection = await mongoose.connect(DB_URI);
        console.log(`MongoDB connected: ${connection.connection.host}`.cyan.underline);
    } catch (error) {
        throw new ApiError(500, "Database connection failed", [], error.stack);
    }
})

module.exports = connectDB;