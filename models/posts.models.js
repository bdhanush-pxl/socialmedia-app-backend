const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    postImage: {
        type: String,
        required: true
    },
    postDescription: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
},{ timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;