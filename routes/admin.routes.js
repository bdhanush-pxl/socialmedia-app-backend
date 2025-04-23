import express from "express";
import {
    getAllUsers,
    deleteUser,
    getAllPosts,
    deletePost,
    getAllReports,
    resolveReport,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const adminRoutes = express.Router();

// User management
adminRoutes.route("/users").get(verifyJWT, verifyAdmin, getAllUsers);
adminRoutes.route("/users/:userId").delete(verifyJWT, verifyAdmin, deleteUser);

// Post management
adminRoutes.route("/posts").get(verifyJWT, verifyAdmin, getAllPosts);
adminRoutes.route("/posts/:postId").delete(verifyJWT, verifyAdmin, deletePost);

// Report management
adminRoutes.route("/reports").get(verifyJWT, verifyAdmin, getAllReports);
adminRoutes.route("/reports/:reportId/resolve").put(verifyJWT, verifyAdmin, resolveReport);

export default adminRoutes;