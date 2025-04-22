import express from 'express';
import { 
    createPost, 
    getAllPosts, 
    getPostById, 
    updatePost, 
    deletePost, 
    likePost, 
    unlikePost, 
    commentOnPost, 
    deleteComment 
} from '../controllers/posts.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const postRoutes = express.Router();

// Create a new post
postRoutes.route('/create-post').post(
    verifyJWT,
    upload, // Multer middleware for handling file uploads
    createPost
);

// Get all posts (with pagination)
postRoutes.route('/getposts').get(
    verifyJWT,
    getAllPosts
);

// Get a single post by ID
postRoutes.route('/:postId').get(
    verifyJWT,
    getPostById
);

// Update a post
postRoutes.route('/:postId').put(
    verifyJWT,
    upload, // Multer middleware for handling file uploads
    updatePost
);

// Delete a post
postRoutes.route('/:postId').delete(
    verifyJWT,
    deletePost
);

// Like a post
postRoutes.route('/:postId/like').put(
    verifyJWT,
    likePost
);

// Unlike a post
postRoutes.route('/:postId/unlike').put(
    verifyJWT,
    unlikePost
);

// Comment on a post
postRoutes.route('/:postId/comment').post(
    verifyJWT,
    commentOnPost
);

// Delete a comment
postRoutes.route('/:postId/comment/:commentId').delete(
    verifyJWT,
    deleteComment
);

export default postRoutes;