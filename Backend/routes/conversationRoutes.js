import express from "express";
import Chat from "../models/Conversation.js";

const router = express.Router();

// Save chat
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { question, answer, files, conversationId } = req.body;

    const newChat = new Chat({ question, answer, files, userId, conversationId });
    await newChat.save();

    res.status(201).json(newChat);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

// Get all chats for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ userId }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

export default router;