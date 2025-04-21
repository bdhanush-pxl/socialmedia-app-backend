import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/dbConnect.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Import routes
app.use('/api/users', userRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});