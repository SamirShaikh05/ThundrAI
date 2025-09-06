import express from 'express';
import Chat from '../models/Conversation.js';

const router = express.Router();

// Save chat
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { question, answer, files, conversationId } = req.body;

    if (!userId || !conversationId || !question || !answer) {
      return res.status(400).json({ error: 'Missing required fields: userId, conversationId, question, answer' });
    }

    const newChat = new Chat({ question, answer, files, userId, conversationId });
    await newChat.save();

    res.status(201).json(newChat);
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Failed to save chat', details: err.message });
  }
});

// Get all chats for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ userId }).sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch chats', details: err.message });
  }
});

// Get chats for a specific conversation
router.get('/:userId/:conversationId', async (req, res) => {
  try {
    const { userId, conversationId } = req.params;
    const chats = await Chat.find({ userId, conversationId }).sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch conversation', details: err.message });
  }
});

// Delete all chats for a conversation
router.delete('/:userId/:conversationId', async (req, res) => {
  try {
    const { userId, conversationId } = req.params;

    if (!userId || !conversationId) {
      return res.status(400).json({ error: 'Missing required fields: userId, conversationId' });
    }

    const result = await Chat.deleteMany({ userId, conversationId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No chats found for this conversation' });
    }

    res.status(200).json({ message: 'Conversation deleted successfully', deletedCount: result.deletedCount });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete conversation', details: err.message });
  }
});

export default router;