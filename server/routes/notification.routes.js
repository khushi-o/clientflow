const express = require("express");
const router = express.Router();
const Notification = require("../models/notification.model");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

// Get all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark one as read
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all as read
router.put("/read-all", async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a notification
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all notifications
router.delete("/", async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;