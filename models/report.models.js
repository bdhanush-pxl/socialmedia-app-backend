import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema({
    reportedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reportedItem: {
        type: Schema.Types.ObjectId,
        required: true, // Can be a user, post, or comment
    },
    itemType: {
        type: String,
        enum: ["user", "post", "comment"],
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "resolved"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;