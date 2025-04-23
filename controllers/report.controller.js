import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import Report from "../models/report.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const reportItem = asyncHandler(async (req, res) => {
    const { reportedItem, itemType, reason } = req.body;
    const userId = req.user._id;
    if (!reportedItem || !itemType || !reason) {
        throw new ApiError(400, "All fields (reportedItem, itemType, reason) are required");
    }
    const report = await Report.create({
        reportedBy: userId,
        reportedItem,
        itemType,
        reason,
    });
    return res.status(201).json(new ApiResponse(201, report, "Report submitted successfully"));
});