import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import User from "../models/user.models.js"
import Post from "../models/posts.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const createPost = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { description } = req.body;

    if (!description && !req.file) {
        throw new ApiError(400, "Post must contain either text or an image");
    }

    let postImageUrl;
    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) {
            throw new ApiError(500, "Error uploading post image to Cloudinary");
        }
        postImageUrl = uploadResult.url;
    }

    const post = await Post.create({
        postedBy: userId,
        postDescription: description,
        postImage: postImageUrl || null,
    });

    return res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find()
        .populate("postedBy", "username profilePicture")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    return res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("postedBy", "username profilePicture");
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    return res.status(200).json(new ApiResponse(200, post, "Post fetched successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { postId } = req.params;
    const { description } = req.body;
    if (!description) {
        throw new ApiError(400, "Post description is required");
    }
    const post = await Post.findById(postId);
    let postImageUrl;
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    if (post.postedBy.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this post");
    }
    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) {
            throw new ApiError(500, "Error uploading post image to Cloudinary");
        }
        postImageUrl = uploadResult.url;
    }
    if (postImageUrl) {
        post.postImage = postImageUrl;
    }
    if (description) {
        post.postDescription = description;
    }
    await post.save();
    return res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { postId } = req.params;
    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    if (post.postedBy.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this post");
    }
    await post.remove();
    return res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});

const likePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    if (post.likes.includes(userId)) {
        throw new ApiError(400, "You have already liked this post");
    }
    post.likes += 1;
    await post.save();
    return res.status(200).json(new ApiResponse(200, null, "Post liked successfully"));
});

const unlikePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    if (post.likes > 0) {
        post.likes -= 1; // Decrement the likes count
        await post.save();
    }
    return res.status(200).json(new ApiResponse(200, null, "Post unliked successfully"));
});

const commentOnPost = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { postId } = req.params;
    const { comment } = req.body;
    if (!comment) {
        throw new ApiError(400, "Comment cannot be empty");
    }
    if(!postId) {
        throw new ApiError(400, "Post ID is required");
    }
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    post.comments.push({
        userId,
        comment,
        createdAt: new Date(),
    });
    await post.save();
    return res.status(200).json(new ApiResponse(200, post.comments, "Comment added successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    if (comment.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }
    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    await post.save();
    return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
});


export {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    commentOnPost,
    deleteComment
}