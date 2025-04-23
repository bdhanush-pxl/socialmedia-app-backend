import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/dbConnect.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import messageRoutes from './routes/message.routes.js';
import reportRoutes from "./routes/report.routes.js";
import adminRoutes from './routes/admin.routes.js';

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
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/admin', adminRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});