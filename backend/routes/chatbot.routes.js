const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const ChatMessage = require("../models/ChatMessage");
const Complaint = require("../models/Complaint");
const askLocalAI = require("../services/localAI.service");
const buildSystemPrompt = require("../services/chatbotPrompt.js");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length < 2) {
      return res.json({ reply: "Please type a valid message." });
    }

    // Fetch complaints (latest updated first)
    const complaints = await Complaint.find({ user: req.user.id })
      .sort({ updatedAt: -1 });

    const normalizedMessage = message.toLowerCase();
    const wantsLatestComplaintStatus =
      normalizedMessage.includes("complaint") &&
      normalizedMessage.includes("status") &&
      (normalizedMessage.includes("latest") ||
        normalizedMessage.includes("recent") ||
        normalizedMessage.includes("current"));

    // Fetch last chat history
    const chatHistory = await ChatMessage.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const historyMessages = chatHistory
      .reverse()
      .map(msg => ({
        role: msg.role,
        content: msg.message
      }));

    // Build system prompt
    const systemPrompt = buildSystemPrompt(req.user, complaints);

    // Save user message
    await ChatMessage.create({
      user: req.user.id,
      role: "user",
      message
    });

    if (wantsLatestComplaintStatus) {
      const latest = complaints[0];
      const reply = latest
        ? `Your latest complaint "${latest.title}" is ${latest.status}.`
        : "You do not have any complaints yet.";

      await ChatMessage.create({
        user: req.user.id,
        role: "assistant",
        message: reply
      });

      return res.json({ reply });
    }

    // Ask AI with history
    const reply = await askLocalAI(
      systemPrompt,
      message,
      historyMessages
    );

    // Save assistant reply
    await ChatMessage.create({
      user: req.user.id,
      role: "assistant",
      message: reply
    });

    res.json({ reply });
  } catch (err) {
    console.error("CHATBOT ERROR:", err.message);
    res.status(500).json({
      reply: "AI service is temporarily unavailable."
    });
  }
});

module.exports = router;
