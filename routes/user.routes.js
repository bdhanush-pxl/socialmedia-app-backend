import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import { registerUser,loginUser,logoutUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const userRoutes = express.Router();

userRoutes.route("/register").post(
    upload,  // Multer middleware
    registerUser
);

userRoutes.route("/login").post(
    loginUser
);

userRoutes.route("/logout").post(
    verifyJWT,
    logoutUser
);

export default userRoutes;