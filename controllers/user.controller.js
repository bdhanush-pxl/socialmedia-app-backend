import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import User from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import bcrypt from "bcrypt"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req,res) =>{
    const {username,email,password} = req.body
    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }
    const isUserExist = await User.findOne({
        $or:[{username},{email}]
    })
    if(isUserExist) {
        throw new ApiError(400, "User already exists")
    }
    let profilePictureUrl;
    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file?.path);
        if (!uploadResult) {
            console.error("Error uploading profile picture to Cloudinary");
            throw new ApiError(400, "Error uploading profile picture");
        }
        profilePictureUrl = uploadResult.url;
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        profilePicture: profilePictureUrl || "https://res.cloudinary.com/dqj0v1x2g/image/upload/v1698236484/blank-profile-picture-973460_640_ojxk5c.png"
    });
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    // Return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
})

const loginUser = asyncHandler(async (req,res) =>{
    const {username,password} = req.body
    if (!username || !password) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await User.findOne({username})
    if(!user) {
        throw new ApiError(401, "User not found")
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if(!isPasswordCorrect) {
        throw new ApiError(400, "Invalid credentials")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
    return res
    .status(200)
    .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false
    })
    .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false
    })
    .json(
        new ApiResponse(200, user, "User logged in successfully")
    )
})

const logoutUser = asyncHandler(async (req,res) =>{
    const userId = req.user._id
    const user = await User.findById(userId)
    if(!user) {
        throw new ApiError(401, "User not found")
    }
    user.refreshToken = null
    await user.save({ validateBeforeSave: false })
    return res
    .status(200)
    .clearCookie("accessToken", {
        httpOnly: true,
        secure: false
    })
    .clearCookie("refreshToken", {
        httpOnly: true,
        secure: false
    })
    .json(
        new ApiResponse(200, null, "User logged out successfully")
    )
})

const changePassword = asyncHandler(async (req,res) =>{
    const {oldpass , newpass} = req.body;
    if(!oldpass || !newpass) {
        throw new ApiError(400, "All fields are required")
    }
    const userId = req.user._id
    const user = await User.findById(userId)
    if(!user) {
        throw new ApiError(401, "User not found")
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldpass)
    if(!isPasswordCorrect) {
        throw new ApiError(400, "Invalid credentials")
    }
    const hashedPassword = await bcrypt.hash(newpass, 10)
    user.password = hashedPassword
    await user.save({ validateBeforeSave: false })
    return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"))
})

const changeProfilePicture = asyncHandler(async (req,res) =>{
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(401, "User not found");
    }
    if (!req.file) {
        throw new ApiError(400, "Profile picture is required");
    }
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
        throw new ApiError(500, "Error uploading profile picture to Cloudinary");
    }
    user.profilePicture = uploadResult.url;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(
        new ApiResponse(200, user, "Profile picture updated successfully")
    );
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(401, "User not found");
    }
    const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!refreshToken) {
        throw new ApiError(401, "Refresh token not found");
    }
    if (user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Invalid refresh token");
    }
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false
        })
        .cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false
        })
        .json(
            new ApiResponse(200, user, "Access token refreshed successfully")
        );
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { username, email, bio} = req.body;
    if (!username && !email && !bio) {
        throw new ApiError(400, "At least one field is required to update");
    }
    if (username && username.length < 3) {
        throw new ApiError(400, "Username must be at least 3 characters long");
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }
    if (bio && bio.length > 200) {
        throw new ApiError(400, "Bio must be less than 200 characters long");
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, user, "User details updated successfully"));
});

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const followUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { followUserId } = req.body;

    if (!followUserId) {
        throw new ApiError(400, "User to follow is required");
    }

    const userToFollow = await User.findById(followUserId);
    if (!userToFollow) {
        throw new ApiError(404, "User to follow not found");
    }
    const userToBeFollowed = {
        userId: userToFollow._id,
        profilePicture: userToFollow.profilePicture,
        username: userToFollow.username
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const userfollowing = {
        userId: user._id,
        profilePicture: user.profilePicture,
        username: user.username
    }
    if (user.following.includes(followUserId)) {
        throw new ApiError(400, "You are already following this user");
    }

    user.following.push(userToBeFollowed);
    userToFollow.followers.push(userfollowing);

    await user.save({ validateBeforeSave: false });
    await userToFollow.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, null, "User followed successfully"));
});

const unfollowUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { unfollowUserId } = req.body;

    if (!unfollowUserId) {
        throw new ApiError(400, "User to unfollow is required");
    }

    const userToUnfollow = await User.findById(unfollowUserId);
    if (!userToUnfollow) {
        throw new ApiError(404, "User to unfollow not found");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.following = user.following.filter(id => id.toString() !== unfollowUserId);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId);

    await user.save({ validateBeforeSave: false });
    await userToUnfollow.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, null, "User unfollowed successfully"));
});

const getFollowers = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userId).populate("followers", "username profilePicture");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user.followers, "Followers fetched successfully"));
});

const deleteUserAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, null, "User account deleted successfully"));
});

const searchUsers = asyncHandler(async (req, res) => {
    const {username} = req.body;

    if (!username) {
        throw new ApiError(400, "username is required");
    }
    const users = await User.find({username}).select("-password -refreshToken").limit(10);
    if (!users || users.length === 0) {
        throw new ApiError(404, "No users found");
    }

    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

export {
    registerUser,
    generateAccessAndRefereshTokens,
    loginUser,
    logoutUser,
    changePassword,
    changeProfilePicture,
    refreshAccessToken,
    updateUserDetails,
    getCurrentUser,
    followUser,
    unfollowUser,
    getFollowers,
    deleteUserAccount,
    searchUsers
}
