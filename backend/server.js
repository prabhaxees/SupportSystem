require("dotenv").config();

const authMiddleware = require("./middleware/auth.middleware");
const authRoutes = require("./routes/auth.routes");
const complaintRoutes = require("./routes/complaint.routes");
const chatbotRoutes = require("./routes/chatbot.routes");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/chatbot", chatbotRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.get("/", (req, res) => {
  res.send("Support System Backend Running");
});

const PORT = 5000;

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
