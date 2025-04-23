import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        unique: true
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
    ],
    refreshToken: {
        type: String,
        default: null
    },
    profilePicture: {
        type: String,
        default: "https://res.cloudinary.com/dqj0v1x2g/image/upload/v1698236484/blank-profile-picture-973460_640_ojxk5c.png"
    },
    bio: {
        type: String,
        default: "Hey there! I am using this app."
    },
    isAdmin: {
        type: Boolean,
        default: false, // Regular users are not admins by default
    },
},{ timestamps: true });

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model('User', userSchema);
export default User;