const express = require("express");
const router = express.Router();
const Message = require("../models/message.model");
const { protect } = require("../middleware/auth.middleware");
const Notification = require("../models/notification.model");
const Project = require("../models/project.model");
router.use(protect);

// Get messages for a project
router.get("/:projectId", async (req, res) => {
  try {
    const messages = await Message.find({ project: req.params.projectId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post a message

router.post("/:projectId", async (req, res) => {
  try {
    const message = await Message.create({
      project: req.params.projectId,
      sender: req.user._id,
      senderName: req.user.name,
      text: req.body.text,
    });

    // Create notification for project owner
    const project = await Project.findById(req.params.projectId);
    if (project && project.owner.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: project.owner,
        title: "New Message",
        message: `${req.user.name} sent a message in ${project.name}`,
        type: "message",
        link: "/messages",
      });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;