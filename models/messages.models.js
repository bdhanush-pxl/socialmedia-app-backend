import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
// This code defines a Mongoose schema and model for a messaging system.
//  The schema includes fields for the sender's ID, receiver's ID, the message text,
//  and a timestamp for when the message was created. 
// The model is then exported for use in other parts of the application.