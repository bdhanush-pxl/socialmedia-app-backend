require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {connectDB} = require('./config/dbConnect.js');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Import routes




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.green.bold);
});