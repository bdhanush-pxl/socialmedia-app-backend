import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import User from "../models/user.models.js"
import Post from "../models/posts.models.js"
import Report from "../models/report.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import bcrypt from "bcrypt"


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password"); // Exclude passwords
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    await user.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().populate("postedBy", "username email");
    return res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    await post.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});

const getAllReports = asyncHandler(async (req, res) => {
    const reports = await Report.find().populate("reportedBy", "username email");
    return res.status(200).json(new ApiResponse(200, reports, "Reports fetched successfully"));
});

const resolveReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);
    if (!report) {
        throw new ApiError(404, "Report not found");
    }
    report.status = "resolved";
    await report.save();
    return res.status(200).json(new ApiResponse(200, null, "Report resolved successfully"));
});


export {
    getAllUsers,
    deleteUser,
    getAllPosts,
    deletePost,
    getAllReports,
    resolveReport,
}