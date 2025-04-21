import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import { registerUser,loginUser,logoutUser,changePassword,changeProfilePicture,refreshAccessToken,getCurrentUser,updateUserDetails,followUser,unfollowUser,getFollowers,deleteUserAccount,searchUsers } from '../controllers/user.controller.js';
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

userRoutes.route("/change-password").post(
    verifyJWT,
    changePassword
);

userRoutes.route("/change-profile-picture").post(
    verifyJWT,
    upload,  // Multer middleware for single file upload
    changeProfilePicture
);

userRoutes.route("/refresh-token").get(
    verifyJWT,
    refreshAccessToken
);

userRoutes.route("/current-user").get(
    verifyJWT,
    getCurrentUser
);

userRoutes.route("/update-user").put(
    verifyJWT,
    updateUserDetails
);

userRoutes.route("/follow").put(
    verifyJWT,
    followUser
);

userRoutes.route("/unfollow").put(
    verifyJWT,
    unfollowUser
);

userRoutes.route("/followers").get(
    verifyJWT,
    getFollowers
);

userRoutes.route("/delete-account").delete(
    verifyJWT,
    deleteUserAccount
);

userRoutes.route("/search").get(
    searchUsers
);


export default userRoutes;