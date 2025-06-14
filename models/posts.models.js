import mongoose, {Schema} from "mongoose";

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
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
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
    isPaid: {
        type: Boolean,
        default: false,
    },
    price: {
        type: Number,
        default: 0, // Price in USD or your preferred currency
    },    
    createdAt: {
        type: Date,
        default: Date.now
    },
},{ timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;