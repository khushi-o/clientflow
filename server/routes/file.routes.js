const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const File = require("../models/file.model");
const { protect } = require("../middleware/auth.middleware");

// Setup upload folder
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.use(protect);

// Get files for a project
router.get("/:projectId", async (req, res) => {
  try {
    const files = await File.find({ project: req.params.projectId })
      .sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload file
router.post("/:projectId", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const file = await File.create({
      filename:       req.file.filename,
      originalName:   req.file.originalname,
      mimetype:       req.file.mimetype,
      size:           req.file.size,
      project:        req.params.projectId,
      uploadedBy:     req.user._id,
      uploadedByName: req.user.name,
    });
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download file
router.get("/download/:fileId", async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: "File not found" });
    const filePath = path.join(uploadDir, file.filename);
    res.download(filePath, file.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete file
router.delete("/:fileId", async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: "File not found" });
    const filePath = path.join(uploadDir, file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await File.findByIdAndDelete(req.params.fileId);
    res.json({ message: "File deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;