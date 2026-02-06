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

    // 1️⃣ Fetch complaints
    const complaints = await Complaint.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    // 2️⃣ Fetch last chat history (INSIDE async route ✅)
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

    // 3️⃣ Build system prompt
    const systemPrompt = buildSystemPrompt(req.user, complaints);

    // 4️⃣ Save user message
    await ChatMessage.create({
      user: req.user.id,
      role: "user",
      message
    });

    // 5️⃣ Ask AI WITH history ✅
    const reply = await askLocalAI(
      systemPrompt,
      message,
      historyMessages
    );

    // 6️⃣ Save assistant reply
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
