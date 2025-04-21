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

export {
    registerUser,
    generateAccessAndRefereshTokens,
    loginUser,
    logoutUser
}
