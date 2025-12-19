import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        default: null
    },
    guest_token: {
        type: String,
        default: null,
        index: true
    },
    sender: {
        type: String,
        enum: ['user', 'bot'],
        default: 'user',
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const ChatMessageModel = mongoose.model("chatMessage", chatMessageSchema);

export default ChatMessageModel;
