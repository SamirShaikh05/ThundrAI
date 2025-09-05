import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  conversationId: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  files: [
    {
      mime_type: String,
      data: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;

