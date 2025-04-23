import express from "express";
import { reportItem } from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const reportRoutes = express.Router();

// Route to submit a report
reportRoutes.route("/").post(verifyJWT, reportItem);

export default reportRoutes;