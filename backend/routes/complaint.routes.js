const adminMiddleware = require("../middleware/admin.middleware");
const express = require("express");
const Complaint = require("../models/Complaint");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// ================= CREATE COMPLAINT =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    const complaint = await Complaint.create({
      user: req.user.id,
      title,
      description,
    });

    res.status(201).json({
      message: "Complaint created",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create complaint" });
  }
});

// ================= GET USER COMPLAINTS =================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  }
);

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const complaint = await Complaint.findById(req.params.id);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      complaint.status = status;
      await complaint.save();

      res.json({
        message: "Status updated",
        complaint,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  }
);


// ================= CANCEL COMPLAINT =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot cancel complaint once processed" });
    }

    await complaint.deleteOne();

    res.json({ message: "Complaint cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel complaint" });
  }
});

module.exports = router;
