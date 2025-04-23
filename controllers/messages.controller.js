import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import Message from "../models/messages.models.js"
import Post from "../models/posts.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const sendMessage = asyncHandler(async (req, res) => {
    const { senderId, receiverId, text } = req.body;
    if (!senderId || !receiverId || !text) {
        throw new ApiError(400, "All fields (senderId, receiverId, text) are required");
    }
    const message = await Message.create({
        senderId,
        receiverId,
        text,
    });
    return res.status(201).json(new ApiResponse(201, message, "Message sent successfully"));
});

const getMessages = asyncHandler(async (req, res) => {
    const { senderId, receiverId } = req.query;
    if (!senderId || !receiverId) {
        throw new ApiError(400, "Both senderId and receiverId are required");
    }
    const messages = await Message.find({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
        ],
    }).sort({ createdAt: 1 }); // Sort messages by creation time
    return res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { senderId } = req.body;
    if (!messageId || !senderId) {
        throw new ApiError(400, "Both messageId and senderId are required");
    }
    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(404, "Message not found");
    }
    if (message.senderId !== senderId) {
        throw new ApiError(403, "You are not authorized to delete this message");
    }
    await message.deleteOne();

    return res.status(200).json(new ApiResponse(200, null, "Message deleted successfully"));
});

const getUserMessages = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const messages = await Message.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 }); // Sort messages by most recent
    return res.status(200).json(new ApiResponse(200, messages, "User messages fetched successfully"));
});

const markMessageAsRead = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(404, "Message not found");
    }
    message.readStatus = true;
    await message.save();
    return res.status(200).json(new ApiResponse(200, message, "Message marked as read"));
});


export {
    sendMessage,
    getMessages,
    deleteMessage,
    getUserMessages,
    markMessageAsRead,
};