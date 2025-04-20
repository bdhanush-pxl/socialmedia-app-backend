const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    followers: [
        {
        userId: String,
        profilePicture: String,
        username: String
        }
    ],
    following: [
        {
        userId: String,
        profilePicture: String,
        username: String
        }
    ],
    posts: [
        {
            postId: String,
            postImage: String,
            postDescription: String,
        }
    ]
},{ timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;