import express from 'express';
import {
    sendMessage,
    getMessages,
    deleteMessage,
    getUserMessages,
    markMessageAsRead,
} from '../controllers/messages.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const messageRoutes = express.Router();

// Send a message
messageRoutes.route('/').post(verifyJWT, sendMessage);

// Get messages between two users
messageRoutes.route('/conversation').get(verifyJWT, getMessages);

// Delete a specific message
messageRoutes.route('/:messageId').delete(verifyJWT, deleteMessage);

// Get all messages for a user
messageRoutes.route('/user/:userId').get(verifyJWT, getUserMessages);

// Mark a message as read
messageRoutes.route('/:messageId/read').put(verifyJWT, markMessageAsRead);

export default messageRoutes;